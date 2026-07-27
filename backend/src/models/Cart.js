import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    guestId: {
      type: String,
      required: [true, 'Guest ID is required'],
      unique: true,
      index: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        size: {
          type: String,
          default: null,
        },
        color: {
          type: String,
          default: null,
        },
      },
    ],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate totals
cartSchema.pre('save', async function (next) {
  try {
    // Populate product data to calculate totals
    await this.populate('items.productId');
    
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.items.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      return sum + price * item.quantity;
    }, 0);
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to add item to cart
cartSchema.methods.addItem = async function (productId, quantity = 1, size = null, color = null) {
  const existingItem = this.items.find(
    item => 
      item.productId.toString() === productId.toString() &&
      item.size === size &&
      item.color === color
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ productId, quantity, size, color });
  }

  await this.save();
  return this;
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function (productId, size = null, color = null) {
  this.items = this.items.filter(
    item => 
      !(item.productId.toString() === productId.toString() &&
      item.size === size &&
      item.color === color)
  );
  await this.save();
  return this;
};

// Method to update item quantity
cartSchema.methods.updateQuantity = async function (productId, quantity, size = null, color = null) {
  const item = this.items.find(
    item => 
      item.productId.toString() === productId.toString() &&
      item.size === size &&
      item.color === color
  );
  
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId, size, color);
    }
    item.quantity = quantity;
    await this.save();
  }
  return this;
};

// Method to clear cart
cartSchema.methods.clearCart = async function () {
  this.items = [];
  await this.save();
  return this;
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;