"use client";
import { useEffect,useState } from 'react';
import { supabase } from '../lib/supabase';
export default function usePublished(table) {
 const [rows,setRows]=useState([]); const [loaded,setLoaded]=useState(false);
 useEffect(()=>{let alive=true;setLoaded(false);if(!supabase){setLoaded(true);return;}
 supabase.from(table).select('*').eq('published',true).order('created_at',{ascending:false}).then(({data,error})=>{if(alive){if(error)console.warn('Content fetch:',error.message);setRows(data||[]);setLoaded(true);}});
 return ()=>{alive=false};},[table]);
 return {rows,loaded};
}
