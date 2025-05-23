const form = document.getElementById('form');
const productInput = document.getElementById('product');
const submitBtn = document.getElementById('submit-btn');
const productList = document.getElementById('product-list');
const message = document.getElementById('message');

let editMode = false;
let editId = null;

function showMessage(text) {
  message.textContent = text;
  message.style.display = 'block';
  setTimeout(() => {
    message.style.display = 'none';
  }, 1500);
}

function createProductElement(id, value) {
  const element = document.createElement('article');
  element.classList.add('article');
  element.setAttribute('data-id', id);
  element.innerHTML = `
    <p class="title">${value}</p>
    <div class='btn-container'>
      <button type="button" class='edit-btn'><i class='fas fa-edit'></i></button>
      <button type="button" class='delete-btn'><i class='fas fa-trash'></i></button>
    </div>
  `;

  element.querySelector('.delete-btn').addEventListener('click', () => deleteProduct(id, element));
  element.querySelector('.edit-btn').addEventListener('click', () => startEdit(id, value));
  productList.appendChild(element);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const value = productInput.value.trim();

  if (!value) return;

  if (editMode) {
    updateProduct(editId, value);
  } else {
    const id = new Date().getTime().toString();
    createProductElement(id, value);
    addToLocalStorage(id, value);
    showMessage('Продукт додано!');
  }

  productInput.value = '';
  submitBtn.textContent = 'Додати';
  editMode = false;
});

function startEdit(id, value) {
  productInput.value = value;
  submitBtn.textContent = 'Редагувати';
  editMode = true;
  editId = id;
}

function updateProduct(id, newValue) {
  const element = document.querySelector(`[data-id="${id}"]`);
  element.querySelector('.title').textContent = newValue;
  updateLocalStorage(id, newValue);
  showMessage('Продукт оновлено!');
}

function deleteProduct(id, element) {
  productList.removeChild(element);
  removeFromLocalStorage(id);
  showMessage('Продукт видалено!');
}

function getLocalData() {
  return JSON.parse(localStorage.getItem('products')) || [];
}

function setLocalData(data) {
  localStorage.setItem('products', JSON.stringify(data));
}

function addToLocalStorage(id, value) {
  const data = getLocalData();
  data.push({ id, value });
  setLocalData(data);
}

function removeFromLocalStorage(id) {
  let data = getLocalData();
  data = data.filter(item => item.id !== id);
  setLocalData(data);
}

function updateLocalStorage(id, newValue) {
  const data = getLocalData().map(item =>
    item.id === id ? { ...item, value: newValue } : item
  );
  setLocalData(data);
}

window.addEventListener('DOMContentLoaded', () => {
  const data = getLocalData();
  data.forEach(item => createProductElement(item.id, item.value));
});
