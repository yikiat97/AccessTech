export function calculateUpdatedPrice(cartItems, unique_id, specialRequests) {
    const cartItem = cartItems.find((item) => item.unique_id === unique_id);
    
    let updatedPrice = cartItem.price;
  
    if (specialRequests.length === 0) {
      let totalSpecialInstructionPrice = 0;
      cartItem.specialInstructions.forEach((instruction) => {
        totalSpecialInstructionPrice += instruction.special_comments_price;
      });
      updatedPrice = cartItem.price - totalSpecialInstructionPrice;
      return updatedPrice;
    }
    
    specialRequests.forEach((request) => {
      const specialRequest = cartItem.specialInstructions.find(
        (itemRequest) => itemRequest.special_comments_id === request.special_comments_id
      );
  
      if (specialRequest) {
        updatedPrice += 0;
      } else {
        updatedPrice += request.special_comments_price;
      }
    });
  
    cartItem.specialInstructions.forEach((existingRequest) => {
      const isStillPresent = specialRequests.find(
        (request) => request.special_comments_id === existingRequest.special_comments_id
      );
  
      if (!isStillPresent) {
        updatedPrice -= existingRequest.special_comments_price;
      }
    });
  
    
    return updatedPrice;
  }
  