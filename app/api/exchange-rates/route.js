import { NextResponse } from "next/server";
export const revalidate = 3600;
export async function GET(){
  try {
    const response=await fetch("https://open.er-api.com/v6/latest/USD",{next:{revalidate:3600},signal:AbortSignal.timeout(8000)});
    if(!response.ok)throw new Error("Rate service unavailable");
    const data=await response.json();
    if(data.result!=="success"||!data.rates?.EUR||!data.rates?.GEL)throw new Error("Invalid exchange rates");
    return NextResponse.json({rates:{USD:1,EUR:data.rates.EUR,GEL:data.rates.GEL},updated:data.time_last_update_utc,source:"open.er-api.com"});
  }catch{return NextResponse.json({rates:{USD:1},unavailable:true},{status:503})}
}
