export const menuData = [
  {
    id: 'home',
    label: 'Trang chủ',
    page: null,
    submenu: null
  },
  {
    id: 'products',
    label: 'Sản phẩm',
    page: null,
    submenu: [
      {
        id: 'electronics',
        label: 'Điện tử',
        page: 'Electronics',
        submenu: null
      },
      {
        id: 'clothing',
        label: 'Quần áo',
        page: 'Clothing',
        submenu: null
      }
    ]
  },
  {
    id: 'about',
    label: 'Giới thiệu',
    page: 'About',
    submenu: null
  }
]
