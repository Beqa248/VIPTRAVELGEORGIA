"use client";
import useTranslatedFields from "./useTranslatedFields";
export default function TranslatedText({text,as:Tag="span",...props}){const [value]=useTranslatedFields([text||""]);return <Tag {...props}>{value}</Tag>}
