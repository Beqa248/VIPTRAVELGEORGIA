VIPTravelGeorgia SEO Patch — https://viptravelgeorgia.vercel.app

1. ატვირთე ZIP-ის ფაილები GitHub-ის შესაბამის მისამართებზე (სხვა ფაილები არ წაშალო).
2. Vercel-ში გადაამოწმე NEXT_PUBLIC_SUPABASE_URL და NEXT_PUBLIC_SUPABASE_ANON_KEY.
3. გაუშვი Vercel Preview და შეამოწმე /sitemap.xml და /robots.txt.
4. გადაამოწმე ერთი გამოქვეყნებული ტური: /tour/<slug> — სათაური, აღწერა და გაზიარების სურათი.
5. Google Search Console-ში დაამატე URL-prefix property: https://viptravelgeorgia.vercel.app
6. Sitemap წარადგინე: https://viptravelgeorgia.vercel.app/sitemap.xml

შეზღუდვები:
- ამჟამად ენის შეცვლა კლიენტურია; ცალკე ინდექსირებადი /ka/, /ru/, /he/ URL-ები არ არის.
  ამიტომ hreflang ჯერ არ არის დამატებული. მომავალში საჭიროა ენობრივი URL-ები და სერვერული metadata.
- SEO არ იძლევა Google-ში კონკრეტული პოზიციის გარანტიას.
- robots.txt-ში /admin და /api დაბლოკილია; admin გვერდების ავტორიზაცია მაინც აუცილებელია.
- Facebook/WhatsApp preview გამოიყენებს cover_url-ს მხოლოდ თუ ის სრული http(s) მისამართია.
- SEO არ ცვლის ტურის გამოქვეყნების წესებს, ფასებს ან Admin-ის ფუნქციებს.
- Google Search Console-ის ვერიფიკაცია ხელით უნდა გააკეთო.
- სრული production build-ის შედეგი შეამოწმე Vercel-ში.
