document.addEventListener('DOMContentLoaded', () => {

  const menuicon = document.getElementById('menuicon');
  const dropdownList = document.getElementById('dropdownList');
  const cartBtn = document.getElementById('cartBtn');
  const cartDropdown = document.getElementById('cartDropdown');
  const bellBtn = document.getElementById('bellBtn');
  const bellDropdown = document.getElementById('bellDropdown');
  const userBtn = document.getElementById('userBtn');
  const userDropdown = document.getElementById('userDropdown');

  if (!menuicon) return;

  function closeAll() {
    dropdownList?.classList.add('hidden');
    cartDropdown?.classList.add('hidden');
    bellDropdown?.classList.add('hidden');
    userDropdown?.classList.add('hidden');
    if (menuicon) {
      menuicon.innerHTML = '<i class="fa-solid fa-bars text-[14px]"></i>';
    }
  }

  // Menu icon next to title
  menuicon.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = dropdownList.classList.contains('hidden');
    closeAll();
    if (isHidden) {
      dropdownList.classList.remove('hidden');
      menuicon.innerHTML = '<i class="fa-solid fa-xmark text-[14px]"></i>';
    }
  });

  // Cart
  cartBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = cartDropdown.classList.contains('hidden');
    closeAll();
    if (isHidden) cartDropdown.classList.remove('hidden');
  });

  // Bell
  bellBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = bellDropdown.classList.contains('hidden');
    closeAll();
    if (isHidden) bellDropdown.classList.remove('hidden');
  });

  // User
  userBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = userDropdown.classList.contains('hidden');
    closeAll();
    if (isHidden) userDropdown.classList.remove('hidden');
  });

  // Close when click outside
  document.addEventListener('click', closeAll);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
});