document.addEventListener('DOMContentLoaded', () => {
  // 아이템 목록 가져오기
  fetchItems();

  // 카테고리 필터링 이벤트 리스너
  setupCategoryFilters();

  // 검색 및 정렬 이벤트 리스너
  setupSearchAndSort();

  // 모달 관련 이벤트 리스너
  setupModalListeners();

  // 카테고리 목록 가져오기
  fetchCategories();

  fetchUserItems();
});

// 아이템 목록 가져오기 (api.items.findAll 사용)
async function fetchItems(category = 'all', sort = 'priceAsc', search = '') {
  const itemsContainer = document.getElementById('itemsContainer');

  // 로딩 스피너 표시
  itemsContainer.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>아이템을 불러오는 중...</p>
      </div>
    `;

  try {
    // api.items.findAll 호출하여 모든 아이템 가져오기
    const response = await api.items.findAll();
    let items = response.data || response;

    // 클라이언트 측 필터링
    if (category !== 'all') {
      items = items.filter((item) => item.category === category);
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(search.toLowerCase())),
      );
    }

    // 정렬 적용
    if (sort === 'priceAsc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceDesc') {
      items.sort((a, b) => b.price - a.price);
    }

    // 아이템이 없는 경우
    if (items.length === 0) {
      itemsContainer.innerHTML = `
          <div class="no-items">
            <p>검색 결과가 없습니다.</p>
          </div>
        `;
      return;
    }

    // 아이템 목록 표시
    itemsContainer.innerHTML = '';
    items.forEach((item) => {
      const itemCard = createItemCard(item);
      itemsContainer.appendChild(itemCard);
    });
  } catch (error) {
    console.error('아이템 목록 가져오기 오류:', error);
    itemsContainer.innerHTML = `
        <div class="error-message">
          <p>아이템을 불러오는데 실패했습니다. 다시 시도해주세요.</p>
          <button class="retry-btn" onclick="fetchItems()">다시 시도</button>
        </div>
      `;
  }
}

// 사용자 아이템 목록 가져오기 (api.userItem.findMyItems 사용)
async function fetchUserItems() {
  const userItemsContainer = document.getElementById('userItemsContainer');

  // 로딩 스피너 표시
  userItemsContainer.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>내 아이템을 불러오는 중...</p>
        </div>
      `;

  try {
    // api.userItem.findMyItems 호출하여 사용자 아이템 가져오기
    const response = await api.userItem.findMyItems();
    // console.log(
    //   `shop.js - findMyItems 호출: ${JSON.stringify(response, null, 2)}`,
    // );
    const userItems = response.data || response;

    // 아이템이 없는 경우
    if (userItems.length === 0) {
      userItemsContainer.innerHTML = `
            <div class="no-items-message">
              <p>보유한 아이템이 없습니다.</p>
            </div>
          `;
      return;
    }

    // item.id 기준으로 그룹화하고, 총 수량을 계산
    const groupedItems = {};
    userItems.forEach((userItem) => {
      // userItem.item가 존재하면 그 안의 id 사용, 아니면 userItem.itemId 사용
      const itemId = userItem.item ? userItem.item.id : userItem.itemId;
      if (!itemId) return; // item 정보가 없으면 건너뜀

      if (groupedItems[itemId]) {
        groupedItems[itemId].quantity += userItem.quantity || 1;
      } else {
        // 초기 그룹에는 item 정보와 quantity를 저장합니다.
        groupedItems[itemId] = {
          item: userItem.item || {}, // API 호출로 따로 item 정보를 가져올 수도 있음
          quantity: userItem.quantity || 1,
        };
      }
    });

    // 사용자 아이템 목록 표시
    userItemsContainer.innerHTML = '';
    for (const itemId in groupedItems) {
      const group = groupedItems[itemId];
      const userItemCard = createUserItemCardGrouped(group);
      userItemsContainer.appendChild(userItemCard);
    }

    // // 각 사용자 아이템에 대해 아이템 정보 가져오기
    // for (const userItem of userItems) {
    //   let itemInfo = userItem.item || {};

    //   // item 속성이 없는 경우 아이템 정보 가져오기 시도
    //   if (!userItem.item && userItem.itemId) {
    //     try {
    //       const itemResponse = await api.items.findOne(userItem.itemId);
    //       itemInfo = itemResponse.data || itemResponse;
    //     } catch (itemError) {
    //       console.error('아이템 정보 가져오기 오류:', itemError);
    //       // 오류가 발생해도 계속 진행
    //     }
    //   }

    //   const userItemCard = createUserItemCard(userItem, itemInfo);
    //   userItemsContainer.appendChild(userItemCard);
    // }
  } catch (error) {
    console.error('사용자 아이템 목록 가져오기 오류:', error);
    userItemsContainer.innerHTML = `
          <div class="user-items-error">
            <p>내 아이템을 불러오는데 실패했습니다.</p>
            <button class="retry-btn" onclick="fetchUserItems()">다시 시도</button>
          </div>
        `;
  }
}

function createUserItemCardGrouped(group) {
  const itemInfo = group.item;
  const quantity = group.quantity;

  const userItemCard = document.createElement('div');
  userItemCard.className = 'user-item-card';

  // 이미지 URL 처리: 없으면 기본 텍스트로 처리
  const imageUrl = itemInfo.imageUrl
    ? `/imageFile/${encodeURIComponent(itemInfo.imageUrl)}`
    : `/imageFile/placeholder.svg?height=40&width=40&text=${encodeURIComponent(itemInfo.name || '아이템')}`;

  userItemCard.innerHTML = `
      <img src="${imageUrl}" alt="${itemInfo.name || '아이템'}" class="user-item-image" 
        onerror="this.src='/placeholder.svg?height=40&width=40&text=이미지 없음'; this.onerror=null;">
      <div class="user-item-details">
        <p class="user-item-name">${itemInfo.name || '이름 없는 아이템'}</p>
        ${itemInfo.category ? `<p class="user-item-category">${itemInfo.category}</p>` : ''}
        ${quantity ? `<p class="user-item-quantity">X${quantity}</p>` : ''}
      </div>
    `;
  return userItemCard;
}

// 사용자 아이템 카드 생성 함수 - 새로 추가됨
function createUserItemCard(userItem, itemInfo) {
  const userItemCard = document.createElement('div');
  userItemCard.className = 'user-item-card';

  // 이미지 URL이 없는 경우 기본 이미지 사용
  const imageUrl = itemInfo.imageUrl
    ? `/imageFile/${encodeURIComponent(itemInfo.imageUrl)}`
    : `/placeholder.svg?height=40&width=40&text=${encodeURIComponent(itemInfo.name || '아이템')}`;

  userItemCard.innerHTML = `
        <img src="${imageUrl}" alt="${itemInfo.name || '아이템'}" class="user-item-image" 
          onerror="this.src='/placeholder.svg?height=40&width=40&text=이미지 없음'; this.onerror=null;">
        <div class="user-item-details">
          <p class="user-item-name">${itemInfo.name || '이름 없는 아이템'}</p>
          ${itemInfo.category ? `<p class="user-item-category">${itemInfo.category}</p>` : ''}
        </div>
      `;

  return userItemCard;
}

// 카테고리 목록 가져오기
async function fetchCategories() {
  try {
    const response = await api.items.findAll();
    const items = response.data || response;

    // 중복 없는 카테고리 목록 추출
    const categories = [
      ...new Set(items.map((item) => item.category).filter(Boolean)),
    ];

    // 카테고리 드롭다운 업데이트
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">전체</option>';

    // 사이드바 카테고리 목록 업데이트
    const categoryList = document.querySelector('.category-list');
    categoryList.innerHTML =
      '<li class="category-item active" data-category="all">전체 아이템</li>';

    // 각 카테고리 추가
    categories.forEach((category) => {
      if (category) {
        // 드롭다운에 추가
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);

        // 사이드바에 추가
        const li = document.createElement('li');
        li.className = 'category-item';
        li.dataset.category = category;
        li.textContent = category;
        categoryList.appendChild(li);
      }
    });

    // 카테고리 이벤트 리스너 다시 설정
    setupCategoryFilters();
  } catch (error) {
    console.error('카테고리 목록 가져오기 오류:', error);
  }
}

// 아이템 카드 생성 함수 (이미지 로드 실패 시 "이미지 없음" 텍스트로 대체)
function createItemCard(item) {
  const itemCard = document.createElement('div');
  itemCard.className = 'item-card';
  itemCard.dataset.itemId = item.id;

  // 이미지 URL이 없는 경우 기본 이미지 URL 생성
  const imageUrl = item.imageUrl
    ? `/imageFile/${encodeURIComponent(itemInfo.imageUrl)}`
    : `/imageFile/placeholder.svg?height=40&width=40&text=${encodeURIComponent(item.name || '아이템')}`;

  // 카테고리 태그 (카테고리가 있는 경우에만 표시)
  const categoryTag = item.category
    ? `<span class="item-category-tag">${item.category}</span>`
    : '';

  itemCard.innerHTML = `
        ${categoryTag}
        <img src="${imageUrl}" alt="${item.name || '아이템'}" class="item-image">
        <div class="item-details">
          <h3 class="item-name">${item.name || '이름 없는 아이템'}</h3>
          <span class="item-price">${(item.price || 0).toLocaleString()} 포인트</span>
        </div>
      `;

  // 이미지 로드 실패 시 "이미지 없음" 텍스트로 대체
  const img = itemCard.querySelector('img.item-image');
  img.addEventListener('error', function () {
    const noImageDiv = document.createElement('div');
    noImageDiv.className = 'no-image-text';
    noImageDiv.textContent = '이미지 없음';
    this.parentNode.replaceChild(noImageDiv, this);
  });

  // 아이템 클릭 시 모달 표시
  itemCard.addEventListener('click', () => {
    showItemModal(item);
  });

  return itemCard;
}

// 카테고리 필터링 설정
function setupCategoryFilters() {
  const categoryItems = document.querySelectorAll('.category-item');
  const categoryFilter = document.getElementById('categoryFilter');

  // 사이드바 카테고리 클릭 이벤트
  categoryItems.forEach((item) => {
    item.addEventListener('click', () => {
      // 활성 클래스 토글
      categoryItems.forEach((cat) => cat.classList.remove('active'));
      item.classList.add('active');

      // 선택된 카테고리로 아이템 필터링
      const category = item.dataset.category;
      categoryFilter.value = category; // 드롭다운 값도 동기화

      // 현재 정렬 및 검색어 유지하며 아이템 다시 가져오기
      const sort = document.getElementById('sortFilter').value;
      const search = document.getElementById('searchInput').value;
      fetchItems(category, sort, search);
    });
  });

  // 드롭다운 카테고리 변경 이벤트
  categoryFilter.addEventListener('change', () => {
    const category = categoryFilter.value;

    // 사이드바 카테고리 활성화 상태 동기화
    categoryItems.forEach((item) => {
      if (item.dataset.category === category) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 현재 정렬 및 검색어 유지하며 아이템 다시 가져오기
    const sort = document.getElementById('sortFilter').value;
    const search = document.getElementById('searchInput').value;
    fetchItems(category, sort, search);
  });
}

// 검색 및 정렬 설정
function setupSearchAndSort() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const sortFilter = document.getElementById('sortFilter');

  // 검색 버튼 클릭 이벤트
  searchBtn.addEventListener('click', () => {
    const search = searchInput.value.trim();
    const category = document.getElementById('categoryFilter').value;
    const sort = sortFilter.value;
    fetchItems(category, sort, search);
  });

  // 검색 입력 필드에서 엔터키 이벤트
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const search = searchInput.value.trim();
      const category = document.getElementById('categoryFilter').value;
      const sort = sortFilter.value;
      fetchItems(category, sort, search);
    }
  });

  // 정렬 변경 이벤트
  sortFilter.addEventListener('change', () => {
    const sort = sortFilter.value;
    const category = document.getElementById('categoryFilter').value;
    const search = searchInput.value.trim();
    fetchItems(category, sort, search);
  });
}

// 모달 관련 이벤트 리스너 설정
function setupModalListeners() {
  const itemModal = document.getElementById('itemModal');
  const purchaseCompleteModal = document.getElementById(
    'purchaseCompleteModal',
  );
  const closeModal = document.getElementById('closeModal');
  const closePurchaseModal = document.getElementById('closePurchaseModal');
  const cancelPurchase = document.getElementById('cancelPurchase');
  const confirmPurchase = document.getElementById('confirmPurchase');
  const continueShoppingBtn = document.getElementById('continueShoppingBtn');
  // 구매 실패 모달 이벤트 설정 추가
  const purchaseFailedModal = document.getElementById('purchaseFailedModal');
  const closeFailedModal = document.getElementById('closeFailedModal');
  const confirmFailedModal = document.getElementById('confirmFailedModal');
  //   const goToMyItemsBtn = document.getElementById('goToMyItemsBtn');

  // 모달 닫기 버튼
  closeModal.addEventListener('click', () => {
    itemModal.style.display = 'none';
  });

  closePurchaseModal.addEventListener('click', () => {
    purchaseCompleteModal.style.display = 'none';
  });

  // 구매 취소 버튼
  cancelPurchase.addEventListener('click', () => {
    itemModal.style.display = 'none';
  });

  // 구매 확인 버튼
  confirmPurchase.addEventListener('click', async () => {
    const itemId = confirmPurchase.dataset.itemId;
    console.log(typeof +itemId);
    await purchaseItem(+itemId);
  });

  // 계속 쇼핑하기 버튼
  continueShoppingBtn.addEventListener('click', () => {
    purchaseCompleteModal.style.display = 'none';
  });

  // 내 아이템 보기 버튼
  //   goToMyItemsBtn.addEventListener('click', () => {
  //     purchaseCompleteModal.style.display = 'none';
  //     window.location.href = '/myitems.html';
  //   });

  // 내 아이템 버튼
  //   document.getElementById('myItemsBtn').addEventListener('click', () => {
  //     window.location.href = '/myitems.html';
  //   });

  // 모달 외부 클릭 시 닫기
  window.addEventListener('click', (e) => {
    if (e.target === itemModal) {
      itemModal.style.display = 'none';
    }
    if (e.target === purchaseCompleteModal) {
      purchaseCompleteModal.style.display = 'none';
    }
  });

  // 닫기 버튼 이벤트
  closeFailedModal.addEventListener('click', () => {
    purchaseFailedModal.style.display = 'none';
  });

  // 확인 버튼 이벤트
  confirmFailedModal.addEventListener('click', () => {
    purchaseFailedModal.style.display = 'none';
  });

  // 모달 외부 클릭 시 닫기 추가
  window.addEventListener('click', (e) => {
    if (e.target === purchaseFailedModal) {
      purchaseFailedModal.style.display = 'none';
    }
  });
}

// 아이템 모달 표시
function showItemModal(item) {
  const itemModal = document.getElementById('itemModal');
  const modalItemName = document.getElementById('modalItemName');
  const modalItemImage = document.getElementById('modalItemImage');
  const modalItemDescription = document.getElementById('modalItemDescription');
  const modalItemPrice = document.getElementById('modalItemPrice');
  const confirmPurchase = document.getElementById('confirmPurchase');

  // 모달 내용 설정
  modalItemName.textContent = item.name || '이름 없는 아이템';

  // 이미지 URL이 없는 경우 기본 이미지 사용
  const imageUrl = item.imageUrl
    ? `/imageFile/${encodeURIComponent(itemInfo.imageUrl)}`
    : `/imageFile/placeholder.svg?height=40&width=40&text=${encodeURIComponent(item.name || '아이템')}`;
  modalItemImage.src = imageUrl;
  modalItemImage.alt = item.name || '아이템 이미지';

  // 이미지 로드 오류 시 "이미지 없음" 텍스트로 대체
  modalItemImage.onerror = function () {
    const noImageDiv = document.createElement('div');
    noImageDiv.className = 'no-image-text';
    noImageDiv.textContent = '이미지 없음';
    this.parentNode.replaceChild(noImageDiv, this);
  };

  // 설명이 없는 경우 기본 텍스트 사용
  modalItemDescription.textContent =
    item.description || '이 아이템에 대한 설명이 없습니다.';
  // 가격 표시 (가격이 없는 경우 0으로 표시)
  modalItemPrice.textContent = `${(item.price || 0).toLocaleString()} 포인트`;

  // 구매 버튼에 아이템 ID 설정
  confirmPurchase.dataset.itemId = item.id;

  // 모달 표시
  itemModal.style.display = 'flex';
}

// 아이템 구매 함수 (api.userItem.purchase 사용)
async function purchaseItem(itemId) {
  const itemModal = document.getElementById('itemModal');
  const confirmPurchase = document.getElementById('confirmPurchase');

  // 구매 버튼 비활성화 및 로딩 상태 표시
  confirmPurchase.disabled = true;
  confirmPurchase.textContent = '구매 중...';

  // 수량 입력 필드의 값을 읽음
  const quantityInput = document.getElementById('purchaseQuantity');
  const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

  try {
    // api.userItem.purchase 호출 시 수량 값을 함께 전달 (API가 이 값을 처리해야 함)
    const purchaseData = await api.userItem.purchase({ itemId, quantity });

    console.log(itemId);
    // 구매한 아이템 정보 가져오기 (선택 사항)
    let itemName = '구매한 아이템';
    try {
      const itemInfo = await api.items.findOne(itemId);
      if (itemInfo && itemInfo.name) {
        itemName = itemInfo.name;
      }
    } catch (itemError) {
      console.error('아이템 정보 가져오기 오류:', itemError);
    }

    const displayData = {
      itemName: itemName,
      remainingPoints: purchaseData.remainingPoints || 0,
    };

    // 구매 완료 모달 표시
    showPurchaseCompleteModal(displayData);
  } catch (error) {
    console.error('아이템 구매 오류:', error);

    if (
      error.errorType === 'NotFoundException' &&
      error.message.includes('잔액부족')
    ) {
      showPurchaseFailedModal(error.message);
    } else {
      alert(error.message || '아이템 구매 중 오류가 발생했습니다.');
    }
  } finally {
    confirmPurchase.disabled = false;
    confirmPurchase.textContent = '구매하기';
    itemModal.style.display = 'none';
  }
}

// 구매 완료 모달 표시
function showPurchaseCompleteModal(purchaseData) {
  const purchaseCompleteModal = document.getElementById(
    'purchaseCompleteModal',
  );
  const purchasedItemName = document.getElementById('purchasedItemName');
  const remainingPoints = document.getElementById('remainingPoints');

  // 모달 내용 설정
  purchasedItemName.textContent = purchaseData.itemName || '구매한 아이템';
  remainingPoints.textContent = (
    purchaseData.remainingPoints || 0
  ).toLocaleString();

  // 모달 표시
  purchaseCompleteModal.style.display = 'flex';
}

function showPurchaseFailedModal(message) {
  const purchaseFailedModal = document.getElementById('purchaseFailedModal');
  const purchaseFailedMessage = document.getElementById(
    'purchaseFailedMessage',
  );

  purchaseFailedMessage.textContent =
    message || '잔액이 부족하여 구매에 실패했습니다.';
  purchaseFailedModal.style.display = 'flex';
}
