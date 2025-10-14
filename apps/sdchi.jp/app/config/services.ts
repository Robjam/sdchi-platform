/**
 * General navigation and footer configuration.
 * Service-specific data now lives in the solutions content collection.
 * See content/solutions/ for service metadata.
 */

export const generalNavigation = [
  { name: 'サービス', href: '/#services' },
  { name: '会社概要', href: '/#about' },
  { name: 'ブログ', href: '/blog' },
  { name: 'お問い合わせ', href: '/#contact' },
]

export const footerSections = {
  company: {
    title: '会社情報',
    links: [
      { name: '会社概要', href: '/#about' },
      { name: 'ブログ', href: '/blog' },
      { name: 'お問い合わせ', href: '/#contact' },
      { name: '採用情報', href: '/careers' },
    ]
  },
  legal: {
    title: '法的事項',
    links: [
      { name: 'プライバシーポリシー', href: '/privacy' },
      { name: '利用規約', href: '/terms' },
      { name: 'セキュリティ', href: '/security' },
    ]
  },
  social: [
    { name: 'Twitter', href: '#', icon: 'twitter' },
    { name: 'GitHub', href: '#', icon: 'github' },
    { name: 'LinkedIn', href: '#', icon: 'linkedin' },
  ]
}
