function bestCharge(inputs){
  var allItems = loadAllItems();              //获取商品列表
  var allDiscounts = loadPromotions();         //获取打折信息

  var result = "============= 订餐明细 =============\n"
  // console.log(result);
  //计算原金额
  var food_menu = getAmount(allItems, allDiscounts, inputs);
  // console.log(food_menu.length)
  result = chooseDiscount(food_menu, result);               //选择折扣方式
  console.log(result);
  return result;
}

function getAmount(allItems, allDiscounts, inputs){
  //从订单上获取商品（一次便可获取商品总数，即订单上不会有重复的商品）
  //所有商品所有信息
  var menu = [];
  // console.log("inputs:"+inputs+"\n");
  inputs.forEach(item =>{

    var food = {id: item,
      count:1};
    food = getFoodCount(food);					//获取菜品数量
    // console.log("food:"+food.id+"\t"+food.count);
    food = getFoodPrice(allItems, allDiscounts, food);		//获取菜品单价
    menu.push(food);
  })
  return menu;
}

/**
 * 选择优惠方式
 * @param discount_food
 * @param result
 */
function calculate_discount(discount_food, result) {
  let [discount_1, discount_2, actual_discount] = [0, 0, 0];      //两种打折方式
  // if (discount_food.originMoney >= 30) {
  //   discount_1 = discount_food.originMoney - parseInt(discount_food.originMoney / 30) * 6;
  // }
  discount_1 = parseInt(discount_food.originMoney / 30) * 6;
  discount_2 = discount_food.promotion_food_money;
  console.log("1:"+discount_1+"\t2:"+discount_2+"\n");
  if (discount_2 > discount_1) {
    result += "使用优惠:\n指定菜品半价(";
    for(var i=0; i<discount_food.promotion_food.length-1; i++){
      result = result + discount_food.promotion_food[i] + "，";
    }
    result = result + discount_food.promotion_food[i] + ")，省"
      + discount_food.promotion_food_money + "元\n";
    actual_discount = discount_2;
  }
  else if(discount_food.originMoney > 30){
    result = result + "使用优惠:\n满30减6元，省" + discount_1 + "元\n";
    actual_discount = discount_1;
  }
  let actual_dicount = discount_food.originMoney - actual_discount;
  result += "-----------------------------------\n总计：" +  actual_dicount + "元\n==================================="
  return result;
}

/**
 * 选择折扣方式
 * @param food
 */
function chooseDiscount(food_menu, result){
  // let [discount_1, discount_2] = [0, 0];      //两种打折方式
  var discount_food = {
    originMoney : 0,                      //原总价
    promotion_food : [],                  //折扣食物
    promotion_food_money : 0
  }

  food_menu.forEach(item =>{
    let subtotal = item.count * item.price;
    discount_food.originMoney += subtotal;
    // console.log(item.count+"\t"+item.price+"\t"+subtotal);
    result += item.name + " x " + item.count + " = " + subtotal + "\n";
    if(item.discount === "指定菜品半价"){
      discount_food.promotion_food.push(item.name);
      discount_food.promotion_food_money += subtotal / 2;
    }
  })
  result += "-----------------------------------\n";
  result = calculate_discount(discount_food, result);

  return result;
}

/*
* 获取菜品数量
*/
function getFoodCount(food){
  //去空格
  // food.replace()、

  // console.log("food is "+food.id);
  // let str = food.id.replace(/\s+/g,"").split("x");
  let str = food.id.replace(/\s+/g,"").split("x");


  food['id']= str[0];
  food['count'] = str[1];
  return food;
}

/*
* 获取商品信息：id, name, price, discount
*/
function getFoodPrice(allItems, allDiscounts, food){
  food = getOriginPrice(allItems, food);				//获取商品原价
  // console.log(food.id+"\t"+food.name+"\t"+food.price)
  food = getDiscount(allDiscounts, food);				//获取商品折扣信息
  return food;
}

/*
*获取商品原价
*/
function getOriginPrice(allItems, food){
  for(let item of allItems){
    if(item.id === food.id){
      food.name = item.name;
      food.price = item.price;
    }
  }
  return food;
}

/*
* 获取菜品折扣------------暂时没用
*/
function getDiscountPrice(allDiscounts, food){
//	let discountMenu = {
//		originSubtotal
//	}
  let discount = getDiscount(allDiscounts, food);		//获取菜品折扣
  switch(discount){
    case '指定菜品半价':

  }
}

/*
* 获取菜品折扣类型
*/
function getDiscount(allDiscounts, food){
  food.discount = '满30减6元';
  // console.log("all:"+allDiscounts.items)
  for(let discounts of allDiscounts){
    if(discounts.type != "满30减6元"){
      for(let item of discounts.items){
        if(item === food.id){
          food.discount = discounts.type;
          return food;
        }
      }
    }
  }
  return food;
}

