/*global describe,it,expect*/
'use strict';
describe('Take out food', function () {

  it('it should calculate count and subtotal', () => {
    const tags = ['ITEM0001 x 1', 'ITEM0013 x 2', 'ITEM0022 x 1'];
    let allItems = loadAllItems();
    const expectResult = buildCartItems(tags, allItems);
    const result = [{
      id: 'ITEM0001',
      name: '黄焖鸡',
      price: 18.00,
      count: 1,
      subtotal: 18.00
    }, {
      id: 'ITEM0013',
      name: '肉夹馍',
      price: 6.00,
      count: 2,
      subtotal: 12.00
    }, {
      id: 'ITEM0022',
      name: '凉皮',
      price: 8.00,
      count: 1,
      subtotal: 8.00
    }];

    expect(expectResult).toEqual(result);
  });

  it('it should calculate total', () => {
    const cartItems = [{
      id: 'ITEM0001',
      name: '黄焖鸡',
      price: 18.00,
      count: 1,
      subtotal: 18.00
    }, {
      id: 'ITEM0013',
      name: '肉夹馍',
      price: 6.00,
      count: 2,
      subtotal: 12.00
    }, {
      id: 'ITEM0022',
      name: '凉皮',
      price: 8.00,
      count: 1,
      subtotal: 8.00
    }];
    const expectResult = buildReceiptItems(cartItems);
    const result = {
      cartItem: [{
        id: 'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count: 1,
        subtotal: 18.00
      }, {
        id: 'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count: 2,
        subtotal: 12.00
      }, {
        id: 'ITEM0022',
        name: '凉皮',
        price: 8.00,
        count: 1,
        subtotal: 8.00
      }], total: 38.00
    };
    expect(expectResult).toEqual(result);
  });
  describe('buildReceipt', () => {
    const promotions = loadPromotions();

    it('满30且存在指定商品半价,指定商品更优惠', () => {
      const receiptItem = {
        cartItem: [{
          id: 'ITEM0001',
          name: '黄焖鸡',
          price: 18.00,
          count: 1,
          subtotal: 18.00
        }, {
          id: 'ITEM0013',
          name: '肉夹馍',
          price: 6.00,
          count: 2,
          subtotal: 12.00
        }, {
          id: 'ITEM0022',
          name: '凉皮',
          price: 8.00,
          count: 1,
          subtotal: 8.00
        }], total: 38.00
      };
      const expectResult = buildReceipt(receiptItem, promotions);
      const result = {
        cartItem: [{
          id: 'ITEM0001',
          name: '黄焖鸡',
          price: 18.00,
          count: 1,
          subtotal: 18.00
        }, {
          id: 'ITEM0013',
          name: '肉夹馍',
          price: 6.00,
          count: 2,
          subtotal: 12.00
        }, {
          id: 'ITEM0022',
          name: '凉皮',
          price: 8.00,
          count: 1,
          subtotal: 8.00
        }], total: 25.00,
        totalSaved: 13.00,
        promotionType: {type: '指定菜品半价', item: ['黄焖鸡', '凉皮']}
      };
      expect(expectResult).toEqual(result);
    });

    it('满30且存在指定商品半价,满30减6更优惠', () => {
      const receiptItem = {
        cartItem: [{
          id: 'ITEM0013',
          name: '肉夹馍',
          price: 6.00,
          count: 4,
          subtotal: 24.00
        }, {
          id: 'ITEM0022',
          name: '凉皮',
          price: 8.00,
          count: 1,
          subtotal: 8.00
        }], total: 32.00
      };
      const expectResult = buildReceipt(receiptItem, promotions);
      const result = {
        cartItem: [{
          id: 'ITEM0013',
          name: '肉夹馍',
          price: 6.00,
          count: 4,
          subtotal: 24.00
        }, {
          id: 'ITEM0022',
          name: '凉皮',
          price: 8.00,
          count: 1,
          subtotal: 8.00
        }], total: 26.00,
        totalSaved: 6.00,
        promotionType: '满30减6元'
      };
      expect(expectResult).toEqual(result);
    });

    it('不满30但存在指定商品半价', () => {
      const receiptItem = {
        cartItem: [{
          id: 'ITEM0001',
          name: '黄焖鸡',
          price: 18.00,
          count: 1,
          subtotal: 18.00
        }, {
          id: 'ITEM0022',
          name: '凉皮',
          price: 8.00,
          count: 1,
          subtotal: 8.00
        }], total: 26.00
      };
      const expectResult = buildReceipt(receiptItem, promotions);
      const result = {
        cartItem: [{
          id: 'ITEM0001',
          name: '黄焖鸡',
          price: 18.00,
          count: 1,
          subtotal: 18.00
        }, {
          id: 'ITEM0022',
          name: '凉皮',
          price: 8.00,
          count: 1,
          subtotal: 8.00
        }], total: 13.00,
        totalSaved: 13.00,
        promotionType: {type: '指定菜品半价', item: ['黄焖鸡', '凉皮']}
      };
      expect(expectResult).toEqual(result);
    });

    it('满30但不存在指定商品', () => {
      const receiptItem = {
        cartItem: [{
          id: 'ITEM0030',
          name: '冰锋',
          price: 2.00,
          count: 15,
          subtotal: 30.00
        }], total: 30.00
      };
      const expectResult = buildReceipt(receiptItem, promotions);
      const result = {
        cartItem: [{
          id: 'ITEM0030',
          name: '冰锋',
          price: 2.00,
          count: 15,
          subtotal: 30.00
        }], total: 24.00, totalSaved: 6.00, promotionType: '满30减6元'
      };
      expect(expectResult).toEqual(result);
    });

    it('既不满30也不存在指定商品', () => {
      const receiptItem = {
        cartItem: [{
          id: 'ITEM0030',
          name: '冰锋',
          price: 2.00,
          count: 10,
          subtotal: 20.00
        }], total: 20.00
      };
      const expectResult = buildReceipt(receiptItem, promotions);
      const result = {
        cartItem: [{
          id: 'ITEM0030',
          name: '冰锋',
          price: 2.00,
          count: 10,
          subtotal: 20.00
        }], total: 20.00, totalSaved: 0.00, promotionType: undefined
      };
      expect(expectResult).toEqual(result);
    });
  });

  describe('buildReceiptText', () => {
    it('未满30且没有指定菜品半价', () => {
      const receipt = {
        cartItem: [{
          id: 'ITEM0030',
          name: '冰锋',
          price: 2.00,
          count: 10,
          subtotal: 20.00
        }], total: 20.00, totalSaved: 0.00, promotionType: undefined
      };
      const expectResult = buildReceiptText(receipt);
      const result = `============= 订餐明细 =============
冰锋 x 10 = 20元
-----------------------------------
总计：20元
===================================`;
      expect(expectResult).toEqual(result);
    });

    it('满30且存在指定菜品半价,指定菜品半价更优惠', () => {
      const receipt = {
        cartItem: [{
          id: 'ITEM0001',
          name: '黄焖鸡',
          price: 18.00,
          count: 1,
          subtotal: 18.00
        }, {
          id: 'ITEM0013',
          name: '肉夹馍',
          price: 6.00,
          count: 2,
          subtotal: 12.00
        }, {
          id: 'ITEM0022',
          name: '凉皮',
          price: 8.00,
          count: 1,
          subtotal: 8.00
        }], total: 25.00,
        totalSaved: 13.00,
        promotionType: {type: '指定菜品半价', item: ['黄焖鸡', '凉皮']}
      };
      const expectResult = buildReceiptText(receipt);
      const result = `============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`;
      expect(expectResult).toEqual(result);
    });

    it('满30且存在指定菜品半价,满30更优惠', () => {
      const receipt = {
        cartItem: [{
          id: 'ITEM0013',
          name: '肉夹馍',
          price: 6.00,
          count: 5,
          subtotal: 30.00
        }, {
          id: 'ITEM0022',
          name: '凉皮',
          price: 8.00,
          count: 1,
          subtotal: 8.00
        }], total: 32.00,
        totalSaved: 6.00,
        promotionType: '满30减6元'
      };
      const expectResult = buildReceiptText(receipt);
      const result = `============= 订餐明细 =============
肉夹馍 x 5 = 30元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：32元
===================================`;
      expect(expectResult).toEqual(result);
    });

    it('未满30且存在指定菜品半价', () => {
      const receipt = {
        cartItem: [{
          id: 'ITEM0013',
          name: '肉夹馍',
          price: 6.00,
          count: 2,
          subtotal: 12.00
        }, {
          id: 'ITEM0022',
          name: '凉皮',
          price: 8.00,
          count: 1,
          subtotal: 8.00
        }], total: 16.00,
        totalSaved: 4.00,
        promotionType: {type: '指定菜品半价', item: ['凉皮']}
      };
      const expectResult = buildReceiptText(receipt);
      const result = `============= 订餐明细 =============
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(凉皮)，省4元
-----------------------------------
总计：16元
===================================`;
      expect(expectResult).toEqual(result);
    });
  });

  describe('bestCharge', () => {
    it('should generate best charge when best is 指定菜品半价', function () {
      var inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
      var summary = bestCharge(inputs);
      var expected = `============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`;
      expect(summary).toEqual(expected);
    });

    it('should generate best charge when best is 满30减6元', function () {
      let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
      let summary = bestCharge(inputs);
      let expected = `============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`;
      expect(summary).toEqual(expected)
    });

    it('should generate best charge when no promotion can be used', function () {
      let inputs = ["ITEM0013 x 4"];
      let summary = bestCharge(inputs);
      let expected = `============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`;
      expect(summary).toEqual(expected)
    });
  });
});
