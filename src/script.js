/**
 * Global Variables
 */
let tmp;
let mode = "create";
let imgBase64 = "";

const UI = {
    item_name: document.getElementById("name-item"),
    price: document.getElementById("price"),
    taxes: document.getElementById("taxes"),
    discount: document.getElementById("discount"),
    total: document.getElementById("total"),
    count: document.getElementById("count"),
    category: document.getElementById("category"),
    btn_create: document.getElementById("btn-create"),
    btn_delete_all: document.getElementById("btn-Delet-all"),
    search: document.getElementById("search"),
    searchCategoryList: document.getElementById("search-category-list"),
    image_input: document.getElementById("imgg"),
    file_label: document.getElementById("file-name-custom"),
};

/**
 * 1. Calculate Total
 */
function GetTotal() {
    if (UI.price.value != "") {
        const result =
            (+UI.price.value || 0) +
            (+UI.taxes.value || 0) -
            (+UI.discount.value || 0);
        UI.total.value = result;
        UI.total.style.background = "#040";
    } else {
        UI.total.value = "";
        UI.total.style.background = "#03506f";
    }
}
[UI.price, UI.taxes, UI.discount].forEach((el) =>
    el.addEventListener("input", GetTotal),
);

/**
 * 2. Handle Image Upload
 */
if (UI.image_input) {
    UI.image_input.onchange = function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (event) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = 80;
                    canvas.height = 80;
                    ctx.drawImage(img, 0, 0, 80, 80);
                    imgBase64 = canvas.toDataURL("image/jpeg", 0.5);
                    UI.file_label.innerHTML = "الصورة جاهزة ✅";
                };
            };
        }
    };
}

let datebro = localStorage.prodect ? JSON.parse(localStorage.prodect) : [];

/**
 * 3. Create or Update
 */
UI.btn_create.onclick = function () {
    let newprod = {
        title: UI.item_name.value.trim(),
        price: UI.price.value,
        taxes: UI.taxes.value,
        discount: UI.discount.value,
        total: UI.total.value,
        count: UI.count.value || 1,
        category: UI.category.value,
        image: imgBase64,
    };

    if (newprod.title != "" && newprod.price != "" && newprod.category != "") {
        if (mode === "create") {
            datebro.push(newprod);
        } else {
            if (imgBase64 === "") newprod.image = datebro[tmp].image;
            datebro[tmp] = newprod;
            mode = "create";
            UI.btn_create.innerHTML = "انشاء";
            UI.count.style.display = "block";
        }
        localStorage.setItem("prodect", JSON.stringify(datebro));
        clear_date();
        shoItem();
    } else {
        alert("يرجى ملء الحقول المطلوبة!");
    }
};

function clear_date() {
    UI.item_name.value = "";
    UI.price.value = "";
    UI.taxes.value = "";
    UI.discount.value = "";
    UI.total.value = "";
    UI.count.value = "";
    UI.category.value = "";
    imgBase64 = "";
    UI.total.style.background = "#03506f";
    UI.file_label.innerHTML = "ارفع صورة المنتج (JPG فقط)";
}

/**
 * 4. Helper function to generate Row HTML (Very Important for Search)
 */
function getRowHtml(i) {
    const imgStyle = `width: 40px; height: 40px; object-fit: cover; border-radius: 4px;`;
    const imgDisplay = datebro[i].image
        ? `<img src="${datebro[i].image}" style="${imgStyle}">`
        : `<div style="${imgStyle}" class="bg-gray-700 flex items-center justify-center text-[8px]">No Img</div>`;

    return `
    <tr class="bg-gray-900/50 border-b border-gray-800 transition-all hover:bg-gray-700">
        <td class="p-3">${i + 1}</td>
        <td class="p-3">${imgDisplay}</td>
        <td class="p-3 font-medium">${datebro[i].title}</td>
        <td class="p-3">${datebro[i].price}</td>
        <td class="p-3">${datebro[i].taxes}</td>
        <td class="p-3 text-center font-bold">${datebro[i].count}</td>
        <td class="p-3">${datebro[i].discount}</td>
        <td class="p-3 font-bold text-sky-400">${datebro[i].total}</td>
        <td class="p-3">${datebro[i].category}</td>
        <td class="p-3 text-center">
            <button onclick="updateData(${i})" class="bg-indigo-600 px-3 py-1 rounded text-xs active:scale-90 transition-all">Update</button>
        </td>
        <td class="p-3 text-center">
            <button onclick="delet_item(${i})" class="bg-red-700 px-3 py-1 rounded text-xs active:scale-90 transition-all">Delete</button>
        </td>
    </tr>`;
}

/**
 * 5. Show Items
 */
function shoItem() {
    let table = "";
    for (let i = 0; i < datebro.length; i++) {
        table += getRowHtml(i);
    }
    document.getElementById("tbody").innerHTML = table;
}

/**
 * 6. Delete & Update Functions
 */
function delet_item(i) {
    datebro.splice(i, 1);
    localStorage.prodect = JSON.stringify(datebro);
    shoItem();
}

function updateData(i) {
    UI.item_name.value = datebro[i].title;
    UI.price.value = datebro[i].price;
    UI.taxes.value = datebro[i].taxes;
    UI.discount.value = datebro[i].discount;
    UI.category.value = datebro[i].category;
    UI.count.value = datebro[i].count;
    GetTotal();
    UI.btn_create.innerHTML = "تحديث البيانات";
    mode = "update";
    tmp = i;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * 7. Search Logic
 */
let SearchMod = "title";

function getSerchMood(id) {
    if (id === "btn-Search-By-title") {
        SearchMod = "title";
        UI.search.classList.remove("hidden");
        UI.searchCategoryList.classList.add("hidden");
        UI.search.placeholder = "بحث بواسطة الاسم...";
    } else {
        SearchMod = "category";
        UI.search.classList.add("hidden");
        UI.searchCategoryList.classList.remove("hidden");

        UI.searchCategoryList.innerHTML =
            '<option value="">اختر الفئة للبحث...</option>';
        for (let i = 1; i < UI.category.options.length; i++) {
            let opt = UI.category.options[i];
            UI.searchCategoryList.innerHTML += `<option value="${opt.value}">${opt.text}</option>`;
        }
    }
    UI.search.value = "";
    UI.searchCategoryList.value = "";
    shoItem();
}

function searchdate(value) {
    let table = "";
    for (let i = 0; i < datebro.length; i++) {
        if (SearchMod === "title") {
            if (datebro[i].title.toLowerCase().includes(value.toLowerCase())) {
                table += getRowHtml(i);
            }
        } else {
            if (value === "" || datebro[i].category === value) {
                table += getRowHtml(i);
            }
        }
    }
    document.getElementById("tbody").innerHTML = table;
}

// Initial Run
shoItem();
