//自己的網址路徑
const api_path = "70928manson";
const token = "KUF0FVQiozV0N70IPnaxWELvZeM2";

//總商品
const productList = document.querySelector('.productWrap')
let productData = [];

//購物車資料
let cartData = [];
let cartTotalPrice;

init();

//初始化
function init(){
  getProductList();
  getCartList();
}

//商品總表
function getProductList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(function(response){
    // console.log(response.data.products);
    productData = response.data.products;
    renderProductList();
  }).catch(function (error){
    console.log(error);
  })
}
function renderProductList(product_category){
  let str = "";

  //將productData因應select變化篩選，最一開始初始化時(!product_category)會使所有item被return
  const cacheData = productData.filter(function (item){
    if(product_category == item.category){
      return item;
    }
    if(!product_category || product_category === '全部'){
      return item;
    }
  })
  cacheData.forEach(function(item){
    str += `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#" class="addCardBtn" data-id = "${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT${item.price}</p>
            </li>`;
  })
  productList.innerHTML = str;
}

//產品篩選
const productSelect = document.querySelector('.productSelect');
productSelect.addEventListener('change', filter);
function filter(){
  renderProductList(productSelect.value);
}

//購物車
  //產品頁新增購物車
const cartAddBtn = document.querySelector('.addCardBtn');
  //購物車頁面
const shoppingCart_tableList = document.querySelector('.shoppingCart-tableList');
const cartTotal = document.querySelector('.cartTotal')


function getCartList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
  .then(function (response){
    cartData = response.data.carts;
    cartTotalPrice = response.data.finalTotal;

    renderCartList();
  })
}
function renderCartList(){
  let str = "";
  cartData.forEach(function (item, index){
    str += `
  <tr class = "cartList">
    <td>
        <div class="cardItem-title">
            <img src="${item.product.images}" alt="" referrerpolicy="no-referrer">
            <p>${item.product.title}</p>
         </div>
    </td>
         <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.product.price * item.quantity}</td>
         <td class="discardBtn">
         <a href="#" class="material-icons" data-cartID = "${item.id}">
            clear
         </a>
    </td>
  </tr>
    `
  })
  //渲染購物車項目
  shoppingCart_tableList.innerHTML = str;
  //總價格
  cartTotal.innerHTML = `NT$${cartTotalPrice}`;
}

//新增至購物車 ----------------------------------------------------------------------------------------------------
productList.addEventListener('click' ,function (e){
  e.preventDefault();

  let addCartClass = e.target.getAttribute('class');
  if(addCartClass !== "addCardBtn"){
    return;
  }

  let productId = e.target.getAttribute('data-id');
  let numCheck = 1;  //此處不能為0，numcheck = 0 post回傳400錯誤

  cartData.forEach(function (item){
    if(item.product.id === productId){
      numCheck = item.quantity++;
    }
  })

  
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    "data" :{
      "productId": productId,
      "quantity": numCheck
    }
  }).then(function (response){
    console.log(response.data);
    alert("加入購物車");
    getCartList();
  }).catch(function (error){
    console.log(error);
  })
 
});  

//刪除購物車全部項目
const discardAllBtn = document.querySelector('.discardAllBtn');

discardAllBtn.addEventListener('click', function(e){
  e.preventDefault();

  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
  .then(function (response){
    alert('購物車全數刪除成功~');
    getCartList();
  }).catch(function (error){
    alert('購物車已清空，請勿重複點擊~');
  })
})

//刪除購物車特定項目
shoppingCart_tableList.addEventListener('click', function(e){
  e.preventDefault();

  let deleteCartClass = e.target.getAttribute('class');
  if(deleteCartClass !== "material-icons"){
    return;
  }

  let cartDataID = e.target.getAttribute('data-cartID');
  console.log(cartDataID);

  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartDataID}`)
  .then(function (response){
    alert('此購物車項目刪除成功~');
    getCartList();
  }).catch(function (error){
    alert('鼻要再按了OAO');
  })
  
})