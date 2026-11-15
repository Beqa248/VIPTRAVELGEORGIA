export const GA_ID=process.env.NEXT_PUBLIC_GA_ID || '';
export function publicPage(){return typeof window!=='undefined'&&!/^\/(?:en\/|ka\/|ru\/|he\/)?(?:admin|api)(?:\/|$)/.test(location.pathname);}
export function track(event,kind){try{if(!GA_ID||!publicPage()||window['ga-disable-'+GA_ID]||!window.__vtgGA||localStorage.getItem('vtg-analytics')!=='yes')return;const params={page_location:location.origin+location.pathname,page_referrer:'',page_title:document.title};if(['contact','tour','transfer','custom_tour'].includes(kind))params.inquiry_type=kind;window.gtag('event',event,params);}catch{}}
