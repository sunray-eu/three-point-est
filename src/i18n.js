import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    nativeName: "English",
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
      "Total Cost": "Total Cost",
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
      "Best Case Sum": "Best Case Sum",
      "Most Likely Sum": "Most Likely Sum",
      "Worst Case Sum": "Worst Case Sum",
      "Estimate Sum": "Estimate Sum",
      "Average Estimate": "Average Estimate",
      "Estimate": "Estimate",
      "Rate Override": "Rate Override",
      "Hourly Rate": "Hourly Rate",
      "Average Hourly Rate": "Average Hourly Rate",
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
      "Remove": "Remove",
      "Generate Share Link": "Generate Share Link",
      "Share Link with PDF Download": "Share Link with PDF Download",
      "Share Link with Excel Download": "Share Link with Excel Download",
      "Share Link:": "Share Link:",
      "Share Link (PDF):": "Share Link (PDF):",
      "Share Link (Excel):": "Share Link (Excel):",
      "Description": "Description",
      "None Group": "None",
      "Project Settings": "Project Settings",
      "Project Name": "Project Name",
      "Link copied to clipboard!": "Link copied to clipboard!",
      "Project": "Project",
      "Cost": "Cost",
      "Move task up": "Move task up",
      "Move task down": "Move task down",
      "Duplicate Task": "Duplicate Task",
      "Duplicate": "Duplicate",
      "Remove task": "Remove Task",
    },
  },
  sk: {
    nativeName: "Slovenčina",
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
      "Total Cost": "Celkové náklady",
      "Avg Estimate per Task": "Priemerný vážený odhad na úlohu",
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
      "Most Likely": "Realistický prípad",
      "Worst Case": "Najhorší prípad",
      "Best Case Sum": "Najlepší Dokopy",
      "Most Likely Sum": "Realistický Dokopy",
      "Worst Case Sum": "Najhorší Dokopy",
      "Estimate Sum": "Vážený Dokopy",
      "Average Estimate": "Priemer váženého odhadu",
      "Estimate": "Vážený odhad",
      "Rate Override": "Vlastná h. sadzba",
      "Hourly Rate": "Hodinová sadzba",
      "Average Hourly Rate": "Priemerná hodinová sadzba",
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
      "Generate Share Link": "Vytvoriť zdieľací odkaz",
      "Share Link with PDF Download": "Zdieľací odkaz s PDF sťahovaním",
      "Share Link with Excel Download": "Zdieľací odkaz s Excel sťahovaním",
      "Share Link:": "Zdieľací odkaz:",
      "Share Link (PDF):": "Zdieľací odkaz (PDF):",
      "Share Link (Excel):": "Zdieľací odkaz (Excel):",
      "Description": "Popis",
      "None Group": "Žiadna",
      "Project Settings": "Nastavenia projektu",
      "Project Name": "Názov projektu",
      "Link copied to clipboard!": "Odkaz bol skopírovaný do schránky!",
      "Project": "Projekt",
      "Cost": "Cena",
      "Move task up": "Presunúť úlohu vyššie",
      "Move task down": "Presunúť úlohu nižšie",
      "Duplicate Task": "Duplikovať úlohu",
      "Duplicate": "Duplikovať",
      "Remove task": "Odstrániť úlohu",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
