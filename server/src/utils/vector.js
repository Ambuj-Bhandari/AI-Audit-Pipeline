import { VECTOR_DIMENSIONS } from "../constants/index.js";


export function cosineSimilarity(a=[], v=[]){
    if (!a.length || a.length!=b.length) return 0;

    let dot = 0;
    let magA = 0;
    let magB = 0;
    for(let i=0;i<a.length;i++){
        dot += a[i] * b[i];
        magA+= a[i] * a[i];
        magB+= b[i] * b[i];
    }
    if(magA === 0 || magB === 0) return 0;
    return dot/(Math.sqrt(magA) * Math.sqrt(magB));
}


function fnv1a(str){
    let hash = 0x811c9dc5;
    for(let i=0;i<str.length;i++){
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }

    return hash >>> 0;
}

function seededVector(seed, dims = VECTOR_DIMENSIONS){
    let state = fnv1a(seed) || 1;
    const out = new Array(dims);

    for(let i=0;i<dims;i++){
        state |= 0;
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        out[i] = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    return out;
}

export function buildVectorSpaces(entry){
    return {
        semantic: seededVector(`sem: ${entry.description|| ''}`),
        financial: seededVector(`fin: ${entry.amount}|${entry.debit}|${entry.credit}|${entry.currency}`),
        entity: seededVector(`ent: ${entry.name || ''}|${entry.glNumber || ''}|${entry.companyId || ''}`),
    };
}