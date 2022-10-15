const texts = {
  test: {
    en: 'test',
    ja: 'テスト'
  },
  'Log-in': {
    en: 'Log-in',
    ja: 'ログイン'
  },
  'Logged-in': {
    en: 'Logged in.',
    ja: 'ログインしました。'
  },
  'Log-out': {
    en: 'Log-out',
    ja: 'ログアウト'
  },
  'Logged-out': {
    en: 'Logged out.',
    ja: 'ログアウトしました。'
  },
  'Register': {
    en: 'Register',
    ja: '登録'
  },
  'MinimizeMaximize': {
    en: 'Minimize / Maximize',
    ja: '最小化 / 最大化'
  },
  'TranslateTool' : {
    en: 'Translate tool',
    ja: '翻訳ツール'
  },
  'History': {
    en: 'History',
    ja: '履歴'
  },
  'Information': {
    en: 'Information',
    ja: 'インフォメーション'
  },
  'Close': {
    en: 'Close',
    ja: '閉じる'
  },
  'Required': {
    en: 'Required',
    ja: '入力必須'
  },
  'MailAddress': {
    en: 'E-mail Address',
    ja: 'メールアドレス'
  },
  'Password': {
    en: 'Password',
    ja: 'パスワード'
  },
  'ConfirmPassword': {
    en: 'Confirm Password',
    ja: 'パスワード（確認）'
  },
  'InvalidEmail': {
    en: 'Invalid E-mail address.',
    ja: 'メールアドレスが不正です。'
  },
  'PassMinLengthError': {
    en: 'At least *** characters.',
    ja: '最低***文字必要です。'
  },
  'PassConfirmation': {
    en: 'The Confirm Password confirmation does not match.',
    ja: 'パスワードと一致しません。'
  },
  'Error': {
    en: 'Error',
    ja: 'エラー'
  },
  'Back': {
    en: 'Back',
    ja: '戻る'
  },
  'EnterText': {
    en: 'Enter text',
    ja: 'テキストを入力'
  },
  'Japanese': {
    en: 'Japanese',
    ja: '日本語'
  },
  'English': {
    en: 'English',
    ja: '英語'
  },
  'needToLogin': {
    en: 'you need to Login to use this page.',
    ja: 'このページを利用するにはログインする必要があります。'
  },
  'deleteAll': {
    en: 'Delete All',
    ja: '全て削除する'
  },
  'historyNote1': {
    en: 'Only the 20 latest records are saved.',
    ja: '履歴は最新の20件のみ保存されます。'
  },
  'historyNote2': {
    en: 'If the number exceeds 20, the oldest record will be deleted.',
    ja: '20件を超えると古いものから削除されます。'
  },
  'thereIsNoRecord': {
    en: 'There is no record.',
    ja: '履歴がありません。'
  },
  'deletedHistory': {
    en: "All records deleted.",
    ja: '履歴を削除しました。'
  }
}

const rsTexts = Object.keys(texts).reduce((m, text) => {
  const langs = Object.keys(texts[text])
  langs.forEach(lang => {
    if(!m.hasOwnProperty(lang)) m[lang] = {}
    m[lang][text] = texts[text][lang]
  })
  return m
}, {})

export default rsTexts
