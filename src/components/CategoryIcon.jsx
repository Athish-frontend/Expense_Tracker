import {
  MdRestaurant,
  MdDirectionsBus,
  MdShoppingCart,
  MdReceiptLong,
  MdMovie,
  MdLocalHospital,
  MdSchool,
  MdHome,
  MdMoreHoriz,
  MdWork,
  MdLaptop,
  MdBusinessCenter,
  MdTrendingUp,
  MdCardGiftcard,
  MdAttachMoney,
  MdQrCode2,
  MdCreditCard,
  MdAccountBalance,
  MdCategory
} from 'react-icons/md';

const ICON_MAP = {
  MdRestaurant,
  MdDirectionsBus,
  MdShoppingCart,
  MdReceiptLong,
  MdMovie,
  MdLocalHospital,
  MdSchool,
  MdHome,
  MdMoreHoriz,
  MdWork,
  MdLaptop,
  MdBusinessCenter,
  MdTrendingUp,
  MdCardGiftcard,
  MdAttachMoney,
  MdQrCode2,
  MdCreditCard,
  MdAccountBalance,
  MdCategory
};

export const CategoryIcon = ({ iconName, className = '', size = 20, style = {} }) => {
  const IconComponent = ICON_MAP[iconName] || MdMoreHoriz;
  return <IconComponent className={className} size={size} style={style} />;
};

export default CategoryIcon;
