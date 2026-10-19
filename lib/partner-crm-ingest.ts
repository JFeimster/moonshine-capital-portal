/** Trusted server-only bridge to canonical Partner CRM. Never import from client components. */
export async function sendPartnerApplication(input: {source:string;submission_id:string;email:string;name?:string;agency_name?:string;applicant_type?:string;form_id?:string;answers?:Record<string,unknown>}) {
 const endpoint=process.env.PARTNER_CRM_INGEST_URL;
 const secret=process.env.PARTNER_CRM_INGEST_TOKEN;
 if(!endpoint || !secret) return {configured:false,delivered:false};
 const response=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/json","authorization":`Bearer ${secret}`},body:JSON.stringify(input),cache:"no-store",signal:AbortSignal.timeout(7000)});
 if(!response.ok) throw new Error(`partner_crm_ingest_http_${response.status}`);
 return {configured:true,delivered:true};
}
