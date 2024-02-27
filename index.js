"use strict";
// enumのほうがいい気がするけどなんかちゃんと数字になってくれなかった
const gakkis = ["春ﾀｰﾑ", "夏ﾀｰﾑ", "前学期", "秋ﾀｰﾑ", "冬ﾀｰﾑ", "後学期"];
const headers = ["No.", "科目大区分", "科目中区分", "科目小区分", "科目", "教員氏名", "単位数", "修得年度", "修得学期", "評語", "合否"];
const hyogos = ["不", "合", "可", "良", "優", "秀"];
const sortOrder = {
    "No.": ["No."],
    "科目大区分": ["No."],
    "科目中区分": ["No."],
    "科目小区分": ["No."],
    "科目": ["科目"],
    "教員氏名": ["教員氏名"],
    "単位数": ["単位数"],
    "修得年度": ["修得学期", "修得年度"],
    "修得学期": ["修得学期", "修得年度"],
    "評語": ["評語"],
    "合否": ["評語"],
};
const sortMarker = document.createElement("span");
const sortState = { key: "No.", descending: false };
document.getElementsByName("body")[0]?.addEventListener("load", main);
function main() {
    const tableElement = getSeisekiTableElement();
    if (!tableElement) {
        return;
    }
    for (const cell of tableElement.tHead.rows[0].cells) {
        const header = cell.textContent;
        const keys = sortOrder[header];
        cell.style.cursor = "pointer";
        cell.addEventListener("click", () => {
            const descending = sortState.key == keys.at(-1) && !sortState.descending;
            sortMarker.textContent = descending ? "↓" : "↑";
            cell.appendChild(sortMarker);
            for (const key of keys) {
                sortBy(tableElement, key, descending);
            }
        });
    }
}
function getSeisekiTableElement() {
    const iFrameDocument = document.getElementsByName("body")[0]?.contentDocument;
    if (!iFrameDocument) {
        return;
    }
    return [...iFrameDocument.getElementsByTagName("table")].find(tableElement => tableElement.tHead?.rows[0]?.cells[0]?.classList.contains("seiseki-head"));
}
function sortBy(tableElement, key, descending = false) {
    const rows = [...tableElement.tBodies[0].rows];
    const sign = descending ? -1 : 1;
    rows.sort((rowA, rowB) => {
        const a = toSotable(rowA, key);
        const b = toSotable(rowB, key);
        if (typeof a == "number" && typeof b == "number") {
            return sign * (a - b);
        }
        else if (typeof a == "string" && typeof b == "string") {
            return sign * a.localeCompare(b);
        }
        else {
            return 0; // TypeScriptの敗北
        }
    });
    for (const row of rows) {
        row.parentNode?.appendChild(row);
    }
    sortState.key = key;
    sortState.descending = descending;
}
function toSotable(tableRow, header) {
    const text = tableRow.cells[headers.indexOf(header)].textContent.trim();
    switch (header) {
        case "No.":
        case "修得年度":
            return Number.parseInt(text);
        case "単位数":
            return Number.parseFloat(text);
        case "修得学期":
            return gakkis.indexOf(text);
        case "評語":
            return hyogos.indexOf(text);
        default:
            return text;
    }
}
