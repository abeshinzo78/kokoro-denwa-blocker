/**
 * 心のでんわブロッカー - content.js
 * Google検索結果から「相談窓口」要素を検知し非表示にします。
 *
 * 方針:
 *   - CSS クラス .kokoro-blocked の付与で非表示（styles.css と連動）
 *   - 対象テキストを含む要素を検索し、そのセクション全体を除去
 *   - MutationObserver で動的読み込みにも即応
 *   - innerHTML 不使用
 */

const BLOCKED_CLASS = 'kokoro-blocked';

/** 相談窓口と判定するキーワード群 */
const KEYWORDS = [
  '相談窓口',
  'いのちの電話',
  '自殺予防',
  '自殺対策',
  'よりそいホットライン',
  'こころの健康相談',
  '心の健康相談',
  '自殺防止',
];

/**
 * テキストに相談窓口キーワードが含まれているか
 * @param {string} text
 * @returns {boolean}
 */
function containsKeyword(text) {
  return KEYWORDS.some((kw) => text.includes(kw));
}

/**
 * キーワードを含む要素が Google の「相談窓口パネル」内部にあるか判定する。
 * 相談窓口パネルは g-section-with-header（特別セクション）や
 * role="complementary"（補足情報）としてマークアップされている。
 * 通常の検索結果カード（div[data-hveid]）は対象外とする。
 *
 * @param {Element} el - キーワードを含む要素
 * @returns {Element|null} 除去対象のコンテナ、見つからなければ null
 */
function findConsultationContainer(el) {
  let current = el;
  for (let i = 0; i < 20 && current && current !== document.body; i++) {
    const tag = current.tagName.toLowerCase();

    if (tag === 'g-section-with-header') {
      return current;
    }
    if (current.getAttribute('role') === 'complementary') {
      return current;
    }
    // ナレッジパネル（自殺防止など特定の属性を持つカード）
    if (current.hasAttribute('data-attrid')) {
      return current;
    }

    current = current.parentElement;
    if (!current) break;
  }
  return null;
}

/**
 * ノードを走査し、相談窓口テキストを含む要素を非表示にする。
 *
 * @param {Node} root - 走査ルート
 */
function scanAndBlock(root) {
  if (!root) return;

  // Node.TEXT_NODE の場合は親要素を検査
  const nodes =
    root.nodeType === Node.ELEMENT_NODE
      ? [root, ...root.querySelectorAll('*')]
      : root.parentElement
        ? [root.parentElement]
        : [];

  for (const el of nodes) {
    if (el.nodeType !== Node.ELEMENT_NODE) continue;
    if (el.classList.contains(BLOCKED_CLASS)) continue;

    // 直近のテキスト内容だけを見る（深い子孫のテキストは querySelectorAll が別途拾う）
    // childNodes からテキストノードを集めて判定
    const directText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent)
      .join('');

    if (containsKeyword(directText)) {
      const container = findConsultationContainer(el);
      if (container) {
        container.classList.add(BLOCKED_CLASS);
      }
    }
  }
}

/**
 * MutationObserver: 追加ノードを監視してブロック
 */
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      scanAndBlock(node);
    }
  }
});

/**
 * 初期化
 */
function init() {
  // 監視開始（document.documentElement が存在した時点）
  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // DOM 構築完了後に全文書を一度スキャン（取りこぼし防止）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      scanAndBlock(document.body);
    });
  } else {
    scanAndBlock(document.body);
  }
}

init();
