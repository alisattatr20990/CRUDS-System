const UI = {
    item_name: document.getElementById("name-item"),
    price: document.getElementById("price"),
    taxes: document.getElementById("taxes"),
    ads: document.getElementById("ads"),
    discount: document.getElementById("discount"),
    total: document.getElementById("total"),
    count: document.getElementById("count"),
    category: document.getElementById("category"),
    btn_create: document.getElementById("btn-create"),
    btn_delete_all: document.getElementById("btn-Delet-all"),
};
// get total

function GetTotal() {
    const result =
        (+UI.price.value || 0) +
        (+UI.taxes.value || 0) +
        (+UI.ads.value || 0) -
        (+UI.discount.value || 0);

    UI.total.value = result;
}
[UI.price, UI.taxes, UI.ads, UI.discount].forEach((el) => {
    el.addEventListener("input", GetTotal);
});

// create product

let datebro;
if (localStorage.prodect != null) {
    datebro = JSON.parse(localStorage.prodect);
} else {
    datebro = [];
}

UI.btn_create.addEventListener("click", function () {
    let newprod = {
        title: UI.item_name.value,
        price: UI.price.value,
        taxes: UI.taxes.value,
        ads: UI.ads.value,
        discount: UI.discount.value,
        total: UI.total.value,
        count: UI.count.value,
        category: UI.category.value,
    };
    datebro.push(newprod);
    localStorage.setItem("prodect", JSON.stringify(datebro));

    clear_date();
    shoItem();
});

// clear inputs
function clear_date() {
    UI.item_name.value = "";
    UI.price.value = "";
    UI.taxes.value = "";
    UI.discount.value = "";
    UI.total.value = "";
    UI.ads.value = "";
    UI.count.value = "";
    UI.category.value = "";
}
// read

function shoItem() {
    let table = "";
    for (let i = 0; i < datebro.length; i++) {
        table += `
    <tr class="bg-gray-900/50 hover:bg-gray-700 transition-colors duration-200">
                        <td class="p-3">${i + 1}</td>
                        <td class="p-3 font-medium">${datebro[i].title}</td>
                        <td class="p-3">${datebro[i].price}</td>
                        <td class="p-3">${datebro[i].taxes}</td>
                        <td class="p-3">${datebro[i].ads}</td>
                        <td class="p-3">${datebro[i].discount}</td>
                        <td class="p-3 font-bold text-sky-400">${datebro[i].total}</td>
                        <td class="p-3">${datebro[i].category}</td>
                        <td class="p-3 text-center">
                            <button
                                class="bg-indigo-600 hover:bg-indigo-500 px-4 py-1 rounded transition-all active:scale-90">Update</button>
                        </td>
                        <td class="p-3 text-center">
                            <button
                            onclick="delet_item(${i})"  class="bg-red-700 hover:bg-red-600 px-4 py-1 rounded transition-all active:scale-90">Delete</button>
                        </td>
                    </tr>
                    `;
    }
    document.getElementById("tbody").innerHTML = table;

    if (datebro.length > 0) {
        UI.btn_delete_all.innerHTML = `Delete All (${datebro.length})`;
        UI.btn_delete_all.style.display = 'block'; 
    } else {
        UI.btn_delete_all.style.display = 'none'; 
    }
}

// delete

function delet_item(i) {
    datebro.splice(i, 1);
    localStorage.prodect = JSON.stringify(datebro);
    shoItem();
}

// clean date
function delete_all_data() {
    if (confirm("Are you sure you want to delete everything?")) {
        localStorage.clear(); 
        datebro = [];        
        shoItem();           
    }
}
UI.btn_delete_all.addEventListener("click",delete_all_data);
// update
// search
