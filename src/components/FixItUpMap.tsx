import React, { useEffect, useState, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseClient } from '@supabase/supabase-js'; // Import SupabaseClient type for safety

// Extend the global Window object
declare global {
  interface Window {
    updateStatus: (id: string) => Promise<void>;
  }
}

// Define types
interface Complaint {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category_id: number;
  photo_url: string;
  location_lat: number;
  location_long: number;
  priority: 'high' | 'medium' | 'low';
  status: string;
  created_at: string;
  users: { name: string | null; email: string | null } | null;
  votes: { vote_type: 'upvote' | 'downvote' }[] | null;
}

const FixItUpMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const [markersLayer, setMarkersLayer] = useState<L.LayerGroup | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  // Ensure supabase is typed correctly if possible, or trust the useAuth hook
  const { user, supabase } = useAuth();

  const getCustomIcon = (priority: string) =>
    L.divIcon({
      className: `marker-icon-${priority}`,
      iconSize: [20, 20],
      html: '',
    });

  // --- FIX APPLIED HERE: USING SUPABASE CLIENT INSTEAD OF GENERIC FETCH ---
  const fetchComplaints = useCallback(async () => {
    if (!supabase) {
        console.warn('Supabase client is not available.');
        return [];
    }

    try {
      // Use the Supabase client for data fetching. It handles authentication 
      // and configuration (like the anon key) automatically.
      const { data, error: fetchError } = await supabase
        .from('issues')
        .select(`
          id,
          user_id,
          title,
          description,
          category_id,
          photo_url,
          location_lat,
          location_long,
          priority,
          status,
          created_at,
          users(name, email),
          votes(vote_type)
        `);

      if (fetchError) {
        throw fetchError;
      }

      const complaintData: Complaint[] = data as Complaint[] || [];
      console.log('Complaints fetched:', complaintData.length);
      return complaintData;

    } catch (err: any) {
      // The error should now be a Supabase error, not 'process is not defined'
      console.error('Error fetching complaints:', err.message || err);
      setError(`Failed to load complaints: ${err.message || 'Unknown error'}`);
      return [];
    }
  }, [supabase]);
  // -------------------------------------------------------------------------


  const getIssueCategories = useCallback(async () => {
    if (!supabase) return;
    try {
      // Using the Supabase client here too
      const { data, error: categoryError } = await supabase.from('categories').select('id, name');
      
      if (categoryError) throw categoryError;
      if (!data) return;

      const catMap: Record<number, string> = {};
      data.forEach((cat) => (catMap[cat.id] = cat.name));
      setCategoryMap(catMap);

      const filtersDiv = document.getElementById('issue-filters');
      if (filtersDiv) {
        filtersDiv.innerHTML = '<h4>Issue:</h4>';
        data.forEach((cat) => {
          const label = document.createElement('label');
          label.innerHTML = `<input type="checkbox" class="issue-filter" value="${cat.id}" data-category-id="${cat.id}" checked> ${cat.name}`;
          filtersDiv.appendChild(label);
        });
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err.message || err);
      setError('Failed to load issue categories');
    }
  }, [supabase]);

  const updateMapMarkers = useCallback(async (forceFetch = false) => {
    if (!mapRef.current || !markersLayer) return;

    let currentComplaints = complaints;
    if (currentComplaints.length === 0 || forceFetch) {
      currentComplaints = await fetchComplaints();
      setComplaints(currentComplaints);
    }
    
    if (currentComplaints.length === 0) return;

    markersLayer.clearLayers();

    const selectedPriorities = Array.from(
      document.querySelectorAll<HTMLInputElement>('.priority-filter:checked')
    ).map((el) => el.value);

    const selectedIssues = Array.from(
      document.querySelectorAll<HTMLInputElement>('.issue-filter:checked')
    ).map((el) => el.value);

    const filtered = currentComplaints.filter(
      (c) =>
        c.location_lat != null &&
        c.location_long != null &&
        !isNaN(c.location_lat) && 
        !isNaN(c.location_long) &&
        selectedPriorities.includes(c.priority) &&
        selectedIssues.includes(c.category_id.toString())
    );

    filtered.forEach((c) => {
      const upvotes = c.votes ? c.votes.filter((v) => v.vote_type === 'upvote').length : 0;
      const marker = L.marker([c.location_lat, c.location_long], {
        icon: getCustomIcon(c.priority),
      });

      // Create popup content as DOM element
      const popupContent = document.createElement('div');
      popupContent.className = 'popup-content';
      popupContent.innerHTML = `
        <h4>Complaint ID: ${c.id}</h4>
        <strong>Username:</strong> ${c.users?.name || 'Unknown'}<br>
        <strong>Priority:</strong> <span style="text-transform: capitalize;">${c.priority}</span><br>
        <strong>Issue:</strong> ${categoryMap[c.category_id] || 'N/A'}<br>
        <strong>Description:</strong> ${c.description || 'No description'}<br>
        <strong>Status:</strong> <span class="status-${c.status.toLowerCase().replace(/\s/g, '-')}">${c.status}</span><br>
        <strong>Upvotes:</strong> ${upvotes}<br>
        <hr>
      `;

      const button = document.createElement('button');
      button.textContent = 'Update Status';
      button.addEventListener('click', () => window.updateStatus(c.id));
      popupContent.appendChild(button);

      const mailLink = document.createElement('a');
      mailLink.href = `mailto:${c.users?.email || ''}`;
      mailLink.style.display = 'block';
      mailLink.style.marginTop = '10px';
      mailLink.textContent = 'Send Message to User';
      popupContent.appendChild(mailLink);

      marker.bindPopup(popupContent);
      markersLayer.addLayer(marker);
    });
  }, [complaints, markersLayer, categoryMap, fetchComplaints]);

  useEffect(() => {
    if (!mapRef.current) {
      const mapDiv = document.getElementById('map');
      if (!mapDiv) {
        setError('Map container not found');
        return;
      }

      const defaultLocation: [number, number] = [11.0168, 76.9558]; 
      const map = L.map(mapDiv as HTMLElement).setView(defaultLocation, 13); 

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      setMarkersLayer(layerGroup);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      await getIssueCategories();
      await updateMapMarkers(true); 
    })();
  }, [getIssueCategories, updateMapMarkers]);

  useEffect(() => {
    const controlsDiv = document.querySelector('.map-controls');
    const handleFilterChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.matches('.priority-filter') || target.matches('.issue-filter')) {
        updateMapMarkers(false); 
      }
    };
    if (controlsDiv) controlsDiv.addEventListener('change', handleFilterChange);
    return () => {
      if (controlsDiv) controlsDiv.removeEventListener('change', handleFilterChange);
    };
  }, [updateMapMarkers]);

  useEffect(() => {
    window.updateStatus = async (id: string) => {
      if (!user) {
        alert("You must be logged in to update status.");
        return;
      }
      const newStatus = prompt("Enter new status (e.g., 'In Progress', 'Resolved', 'Submitted'):");
      if (newStatus && supabase) {
        const validStatus = newStatus.trim();
        if (validStatus === '') {
          alert('Status cannot be empty.');
          return;
        }
        try {
          const { error: updateError } = await supabase
            .from('issues')
            .update({ status: validStatus })
            .eq('id', id);
          if (updateError) throw updateError;
          alert('Status updated successfully!');
          updateMapMarkers(true); 
        } catch (err: any) {
          console.error('Update failed:', err.message || err);
          alert(`Error updating status: ${err.message || 'Unknown error'}`);
        }
      }
    };
  }, [updateMapMarkers, supabase, user]);

  return (
    <>
      <style>{`
        .marker-icon-high { background-color: #e74c3c; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5); }
        .marker-icon-medium { background-color: #f39c12; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5); }
        .marker-icon-low { background-color: #2ecc71; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5); }

        .map-controls { position:absolute; top:10px; left:50%; transform:translateX(-50%); background:rgba(255, 255, 255, 0.95); padding:15px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.2); z-index:1000; display:flex; flex-wrap:wrap; gap:20px; justify-content:center; font-family: Arial, sans-serif; }
        .filters { display:flex; gap:15px; align-items:center; border:1px solid #eee; padding:8px 12px; border-radius:6px; }
        .filters h4 { margin:0; font-size:1em; color:#333; }
        .filters label { font-size:0.9em; cursor:pointer; user-select:none; }

        .popup-content { font-size:0.9em; min-width:250px; }
        .popup-content strong { display:inline-block; margin-bottom:5px; color:#555; }
        .popup-content h4 { margin-top:0; margin-bottom:8px; color:#2c3e50; }
        .popup-content button { margin-top:10px; cursor:pointer; padding:8px 12px; border:none; border-radius:5px; background-color:#3498db; color:white; transition: background-color 0.2s; }
        .popup-content button:hover { background-color:#2980b9; }

        .status-resolved { color:#27ae60; font-weight:bold; }
        .status-in-progress { color:#f39c12; font-weight:bold; }
        .status-submitted { color:#3498db; font-weight:bold; }
        .status-rejected { color:#c0392b; font-weight:bold; }
      `}</style>

      <div id="map" style={{ height: '100vh', width: '100%', position: 'absolute', top:0, left:0 }}></div>

      <div className="map-controls">
        <div className="filters">
          <h4>Priority:</h4>
          <label><input type="checkbox" className="priority-filter" value="high" defaultChecked /> High</label>
          <label><input type="checkbox" className="priority-filter" value="medium" defaultChecked /> Medium</label>
          <label><input type="checkbox" className="priority-filter" value="low" defaultChecked /> Low</label>
        </div>
        <div className="filters" id="issue-filters">
          <h4>Issue:</h4>
        </div>
      </div>

      {error && (
        <div style={{ position:'absolute', top:80, left:10, background:'white', padding:10, borderRadius:5, zIndex:1000, border:'1px solid red' }}>
          <p style={{ color:'red', margin:0 }}>Error: {error}</p>
        </div>
      )}
    </>
  );
};

export default FixItUpMap;