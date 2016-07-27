/*global require,module*/

'use strict';

let allItems = require('../src/items');
let promotions = require('../src/promotions');

function bestCharge(selectedItems) {
  const allItem = allItems.loadAllItems();
  const cartItems = buildCartItems(selectedItems, allItem);

  const receiptItems = buildReceiptItems(cartItems);

  const promotion = promotions.loadPromotions();
  const receipt = buildReceipt(receiptItems, promotion);

  const receiptText = buildReceiptText(receipt);

  return receiptText;
}

function buildCartItems(tags, allItems) {
  const cartItems = [];

  for (let tag of tags) {
    const splittedTags = tag.split(' x ');

    for (let allItem of allItems) {
      if (allItem.id === splittedTags[0]) {
        cartItems.push({
          id: allItem.id,
          name: allItem.name,
          count: parseInt(splittedTags[1]),
          subtotal: allItem.price * parseInt(splittedTags[1])
        });
      }
    }
  }

  return cartItems;
}

function buildReceiptItems(cartItems) {
  let total = 0;
  for (let cartItem of cartItems) {
    total += cartItem.subtotal;
  }

  return {cartItem: cartItems, total: total};
}

function buildReceipt(receiptItem, promotions) {
  const receiptA = fullCut(receiptItem);
  const receiptB = discount(receiptItem, promotions);
  if (receiptA.total > receiptB.total) {
    return receiptB;
  } else {
    return receiptA;
  }
}

function fullCut(receiptItem) {
  if (receiptItem.total >= 30) {
    return {cartItem: receiptItem.cartItem, total: receiptItem.total - 6, totalSaved: 6, promotionType: '满30减6元'};
  } else {
    return {cartItem: receiptItem.cartItem, total: receiptItem.total, totalSaved: 0, promotionType: undefined};
  }
}

function discount(receiptItem, promotions) {
  const total = receiptItem.total;
  const items = [];

  for (let cartItem of receiptItem.cartItem) {
    for (let item of promotions[1].items) {
      if (item === cartItem.id) {
        receiptItem.total -= cartItem.subtotal / 2;
        items.push(cartItem.name);
      }
    }
  }

  return {
    cartItem: receiptItem.cartItem,
    total: receiptItem.total,
    totalSaved: total - receiptItem.total,
    promotionType: {type: '指定菜品半价', item: items}
  };
}

function buildReceiptText(receipt) {
  let receiptText = `============= 订餐明细 =============
`;

  for (let cartItem of receipt.cartItem) {
    receiptText += `${cartItem.name} x ${cartItem.count} = ${cartItem.subtotal}元
`;
  }

  receiptText += `-----------------------------------
`;
  if (receipt.totalSaved != 0) {
    receiptText += `使用优惠:
`;
    if (receipt.promotionType.type === '指定菜品半价') {
      receiptText += `指定菜品半价(`;

      receiptText += `${receipt.promotionType.item.join('，')}`;
      receiptText += `)，省${receipt.totalSaved}元
-----------------------------------
`;
    } else {
      receiptText += `满30减6元，`;
      receiptText += `省${receipt.totalSaved}元
-----------------------------------
`;
    }

  }
  receiptText += `总计：${receipt.total}元
===================================`;

  return receiptText;
}

module.exports = {
  bestCharge:bestCharge,
  loadAllItems:allItems.loadAllItems,
  buildCartItems:buildCartItems,
  buildReceiptItems:buildReceiptItems,
  loadPromotions:promotions.loadPromotions,
  buildReceipt:buildReceipt,
  buildReceiptText:buildReceiptText
};
