// 가이드 페이지 JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // 탭 전환 기능 설정
  setupTabs();

  // 애니메이션 효과 설정
  setupAnimations();
});

// 탭 전환 기능
function setupTabs() {
  const tabs = document.querySelectorAll('.guide-tab');
  const tabContents = document.querySelectorAll('.guide-tab-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // 활성 탭 클래스 제거
      tabs.forEach((t) => t.classList.remove('active'));

      // 클릭한 탭 활성화
      tab.classList.add('active');

      // 탭 콘텐츠 전환
      const tabId = tab.dataset.tab;
      tabContents.forEach((content) => {
        content.classList.remove('active');
        if (content.id === tabId) {
          content.classList.add('active');
        }
      });

      // URL 해시 업데이트 (북마크 가능)
      window.location.hash = tabId;
    });
  });

  // URL 해시에 따라 초기 탭 설정
  const hash = window.location.hash.substring(1);
  if (hash) {
    const activeTab = document.querySelector(`.guide-tab[data-tab="${hash}"]`);
    if (activeTab) {
      activeTab.click();
    }
  }
}

// 애니메이션 효과
function setupAnimations() {
  // 규칙 카드 애니메이션
  const ruleCards = document.querySelectorAll('.rule-card');
  animateOnScroll(ruleCards);

  // 역할 카드 애니메이션
  const roleCards = document.querySelectorAll('.role-card');
  animateOnScroll(roleCards);

  // 타임라인 아이템 애니메이션
  const timelineItems = document.querySelectorAll('.timeline-item');
  animateOnScroll(timelineItems);

  // 팁 카드 애니메이션
  const tipCards = document.querySelectorAll('.tip-card');
  animateOnScroll(tipCards);
}

// 스크롤 시 요소 애니메이션
function animateOnScroll(elements) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  elements.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
  });
}

// 직업 정보 데이터 (추후 확장 가능)
const roleData = {
  mafia: {
    name: '마피아',
    type: '악역',
    description: '밤마다 한 명의 시민을 제거할 수 있습니다.',
    abilities: [
      '밤마다 한 명의 플레이어를 지목하여 제거',
      '다른 마피아의 정체를 알 수 있음',
      '밤에 마피아끼리 비밀 채팅 가능',
    ],
    winCondition: '생존한 시민팀 인원이 마피아 인원 이하가 되면 승리',
  },
  citizen: {
    name: '시민',
    type: '선역',
    description:
      '특별한 능력은 없지만, 토론과 투표를 통해 마피아를 찾아내는 중요한 역할을 합니다.',
    abilities: ['낮 시간에 토론 참여', '투표를 통해 의심되는 플레이어 지목'],
    winCondition: '모든 마피아가 제거되면 승리',
  },
  police: {
    name: '경찰',
    type: '선역',
    description: '밤마다 한 명의 플레이어가 마피아인지 조사할 수 있습니다.',
    abilities: [
      '밤마다 한 명의 플레이어 역할 조사',
      '조사 결과는 본인에게만 공개됨',
    ],
    winCondition: '모든 마피아가 제거되면 승리 (시민팀)',
  },
  doctor: {
    name: '의사',
    type: '선역',
    description:
      '밤마다 한 명의 플레이어를 보호하여 마피아의 공격을 막을 수 있습니다.',
    abilities: [
      '밤마다 한 명의 플레이어 보호',
      '보호한 플레이어가 마피아의 타겟이면 살해 취소',
    ],
    winCondition: '모든 마피아가 제거되면 승리 (시민팀)',
  },
  // 추가 직업은 여기에 추가 가능
};
