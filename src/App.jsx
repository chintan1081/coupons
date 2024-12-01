import React, { useState, useEffect } from 'react';
import { Gift, Tag, TicketPercent, Clock } from 'lucide-react';
import img from './assets/img1.png'
const companiesData = [
  {
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
  },
  {
    name: 'Flipkart',
    logo: img,
  },
  {
    name: 'Zomato',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png',
  },
  {
    name: 'Swiggy',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png',
  }
];

const FIXED_DISCOUNTS = [30, 25, 50, 70, 60];

// Utility function to generate random 9-letter code
const generateRandomCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Countdown Timer Component
const CountdownTimer = ({ expirationTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(expirationTime);

  useEffect(() => {
    // Exit early if no time left
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    // Set up an interval to count down
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    // Clean up the interval
    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  // Format time into hours, minutes, seconds
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center bg-red-100 text-red-600 p-2 rounded">
      <Clock className="mr-2 w-4 h-4" />
      <span className="font-bold">{formatTime(timeLeft)}</span>
    </div>
  );
};

const CouponMarketplace = () => {
  const [coupons, setCoupons] = useState([]);

  // Generate or retrieve coupons
  useEffect(() => {
    // Check if we have stored coupons and they're still valid
    const storedCouponsData = localStorage.getItem('couponMarketplaceCoupons');
    const storedTimestamp = localStorage.getItem('couponMarketplaceTimestamp');
    const currentTime = Math.floor(Date.now() / 1000);

    if (storedCouponsData && storedTimestamp) {
      const parsedCoupons = JSON.parse(storedCouponsData);
      const timeSinceStorage = currentTime - parseInt(storedTimestamp);

      // Check if stored coupons are less than 24 hours old
      if (timeSinceStorage < 24 * 3600) {
        // Update expiration times
        const updatedCoupons = parsedCoupons.map(coupon => ({
          ...coupon,
          expirationTime: Math.max(0, coupon.expirationTime - timeSinceStorage)
        }));
        setCoupons(updatedCoupons);
        return;
      }
    }

    // Generate new coupons if no valid stored coupons
    const generateCoupons = () => {
      const totalCoupons = 50;
      const generatedCoupons = Array(totalCoupons).fill().map(() => {
        const randomCompany = companiesData[Math.floor(Math.random() * companiesData.length)];
        
        // Random expiration time between 1-24 hours (in seconds)
        const randomExpirationTime = Math.floor(Math.random() * (24 * 3600)) + (60 * 60); // minimum 1 hour
        
        // Select random discount from fixed values
        const randomDiscount = FIXED_DISCOUNTS[Math.floor(Math.random() * FIXED_DISCOUNTS.length)];
        
        return {
          company: randomCompany.name,
          logo: randomCompany.logo,
          code: generateRandomCode(9),
          expirationTime: randomExpirationTime,
          discount: randomDiscount
        };
      });

      // Store coupons in localStorage
      localStorage.setItem('couponMarketplaceCoupons', JSON.stringify(generatedCoupons));
      localStorage.setItem('couponMarketplaceTimestamp', currentTime.toString());

      setCoupons(generatedCoupons);
    };

    generateCoupons();
  }, []);

  // Handle coupon expiration
  const handleCouponExpire = (index) => {
    const updatedCoupons = [...coupons];
    
    // Generate a new coupon to replace the expired one
    const randomCompany = companiesData[Math.floor(Math.random() * companiesData.length)];
    const newCoupon = {
      company: randomCompany.name,
      logo: randomCompany.logo,
      code: generateRandomCode(9),
      expirationTime: Math.floor(Math.random() * (24 * 3600)) + (60 * 60), // 1-24 hours
      discount: FIXED_DISCOUNTS[Math.floor(Math.random() * FIXED_DISCOUNTS.length)] // Fixed discounts
    };

    // Replace the expired coupon
    updatedCoupons[index] = newCoupon;
    
    // Update localStorage
    localStorage.setItem('couponMarketplaceCoupons', JSON.stringify(updatedCoupons));
    localStorage.setItem('couponMarketplaceTimestamp', Math.floor(Date.now() / 1000).toString());

    setCoupons(updatedCoupons);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center mb-6">
            <Gift className="w-12 h-12 mr-4 text-yellow-300" />
            <h1 className="text-4xl font-extrabold tracking-tight">
              Coupons Marketplace
            </h1>
            <TicketPercent className="w-12 h-12 ml-4 text-yellow-300" />
          </div>
          <p className="text-xl max-w-2xl mx-auto text-blue-100">
            Discover amazing deals and discounts from top brands. Grab your favorite coupons instantly!
          </p>
        </div>
      </div>

      <div className="container mx-auto p-4 -mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {coupons.map((coupon, index) => (
            <div 
              key={`coupon-${index}`} 
              className="bg-white shadow-lg rounded-lg overflow-hidden border transform transition hover:scale-105"
            >
              <div className="p-4 flex justify-center items-center h-48">
                <img 
                  src={coupon.logo} 
                  // src = ''
                  alt={`${coupon.company} Logo`} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-4">
                <p className="font-bold mb-2 text-center">{coupon.company} Coupon</p>
                <div className="bg-gray-100 p-2 rounded flex flex-col items-center space-y-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center bg-green-100 text-green-600 px-2 py-1 rounded">
                      <span className="font-bold">{coupon.discount} % Discount</span>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">
                      {coupon.code}
                    </span>
                  </div>
                  <CountdownTimer 
                    expirationTime={coupon.expirationTime} 
                    onExpire={() => handleCouponExpire(index)}
                  />
                  <button 
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      alert(`Copied ${coupon.code} to clipboard`);
                    }}
                  >
                    Copy Coupon
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponMarketplace;