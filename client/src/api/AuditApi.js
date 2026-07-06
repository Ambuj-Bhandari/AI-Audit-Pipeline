const BASE = import.meta.env.VITE_API_BASE || 'http:localhost:4000';

export default class AuditApi{
    async request(path, options = {}){
        const res = await fetch(`${BASE}${path}`,{
            headers: {'Content-Type':'application/json'},
            ...options
        });

        const data = await res.json().catch(()=> ({}));
        if(!res.ok) throw new Error(data.error || `Request Failed (${res.status})`);
        return data;
        
    }

    listEntries(){
        return this.request('/api/entries');
    }

    getEntry(id){
        return this.request(`/api/entries/${id}`);
    }

    createEntry(payload){
        return this.request('/api/entries', { method: "POST", body: JSON.stringify(payload) });
    }

    updateEntry(id, changes){
        return this.request(`/api/entries/${id}`, { method: "PUT", body: JSON.stringify(changes) });
    }

    reevaluate(id){
        return this.request(`/api/entries/${id}/reevaluate`, { method: "POST" });
    }

    searchSimilar(entryId, strategy){
        return this.request(`/api/entries/search/similar`, { method: "POST", body: JSON.stringify({entryId, strategy}) });
    }
}