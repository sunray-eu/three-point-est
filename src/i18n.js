import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Three Point Estimation App": "Three Point Estimation App",
      "Add New Task": "Add New Task",
      "Clear All": "Clear All",
      "Phase": "Phase",
      "Group": "Group",
      "Ignored": "Ignored",
      "Group Summary": "Group Summary",
      "Phase Summary": "Phase Summary",
      "Total Tasks": "Total Tasks",
      "Total Estimate": "Total Estimate",
      "Total Cost (EUR)": "Total Cost (EUR)",
      "Avg Estimate per Task": "Avg Estimate per Task",
      "Save": "Save",
      "Export to Excel": "Export to Excel",
      "Export to PDF": "Export to PDF",
      "Show Groups": "Show Groups",
      "Show Phases": "Show Phases",
      "Global Cost (EUR per hour)": "Global Cost (EUR per hour)",
      "Group Settings": "Group Settings",
      "Add Group": "Add Group",
      "Phase Settings": "Phase Settings",
      "Add Phase": "Add Phase",
      "ID": "ID",
      "Task Name": "Task Name",
      "Task Desc": "Task Desc",
      "Best Case": "Best Case",
      "Most Likely": "Most Likely",
      "Worst Case": "Worst Case",
      "Estimate": "Estimate",
      "Cost Override": "Cost Override",
      "Hourly Rate": "Hourly Rate",
      "Group Desc": "Group Desc",
      "Phase Desc": "Phase Desc",
      "Tasks": "Tasks",
      "Summary": "Summary",
      "Overall Summary": "Overall Summary",
      "Avg Hourly Rate": "Avg Hourly Rate",
      "Per Phase Summary": "Per Phase Summary",
      "Per Group Summary": "Per Group Summary",
      "Estimation Report Summary": "Estimation Report Summary",
      "Copy of": "Copy of",
      "Task": "Task",
      "Include": "Include",
      "Remove": "Remove"
    }
  },
  sk: {
    translation: {
      "Three Point Estimation App": "Aplikácia odhadu s tromi bodmi",
      "Add New Task": "Pridať nový úlohu",
      "Clear All": "Vymazať všetko",
      "Phase": "Fáza",
      "Group": "Skupina",
      "Ignored": "Ignorované",
      "Group Summary": "Zhrnutie skupiny",
      "Phase Summary": "Zhrnutie fázy",
      "Total Tasks": "Celkový počet úloh",
      "Total Estimate": "Celkový odhad",
      "Total Cost (EUR)": "Celkové náklady (EUR)",
      "Avg Estimate per Task": "Priemerný odhad na úlohu",
      "Save": "Uložiť",
      "Export to Excel": "Exportovať do Excelu",
      "Export to PDF": "Exportovať do PDF",
      "Show Groups": "Zobraziť skupiny",
      "Show Phases": "Zobraziť fázy",
      "Global Cost (EUR per hour)": "Globálna sadzba (EUR za hodinu)",
      "Group Settings": "Nastavenia skupiny",
      "Add Group": "Pridať skupinu",
      "Phase Settings": "Nastavenia fázy",
      "Add Phase": "Pridať fázu",
      "ID": "ID",
      "Task Name": "Názov úlohy",
      "Task Desc": "Popis úlohy",
      "Best Case": "Najlepší prípad",
      "Most Likely": "Najpravdepodobnejší",
      "Worst Case": "Najhorší prípad",
      "Estimate": "Odhad",
      "Cost Override": "Vlastná h. sadzba",
      "Hourly Rate": "Hodinová sadzba",
      "Group Desc": "Popis skupiny",
      "Phase Desc": "Popis fázy",
      "Tasks": "Úlohy",
      "Summary": "Zhrnutie",
      "Overall Summary": "Celkové zhrnutie",
      "Avg Hourly Rate": "Priemerná hodinová sadzba",
      "Per Phase Summary": "Zhrnutie podľa fáz",
      "Per Group Summary": "Zhrnutie podľa skupín",
      "Estimation Report Summary": "Zhrnutie odhadu projektu",
      "Copy of": "Kópia úlohy",
      "Task": "Úloha",
      "Include": "Zahrnúť",
      "Remove": "Odstrániť",
      "Cost": "Cena"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false // React already safeguards from XSS
  }
});

export default i18n;
