export const Sites = [
  "Safe Danbooru",
  "Danbooru",
]

export const Endpoints = {
  [Sites[0]]: "danbooru/safe",
  [Sites[1]]: "danbooru",
}

export const AuthDialogConfigs = {
  [Sites[0]]: {
    title: "Safe Danbooru Login",
    id: "Username",
    idHint: "The username you use to log in with",
    key: "Api Key",
    keyHint: "The API key available from your <a href='https://safebooru.donmai.us/profile' target='_blank'>User Profile</a> under &quot;API Key&quot; (2nd last option under statistics)",
    requiresHash: false,
  },
  [Sites[1]]: {
    title: "Danbooru Login",
    id: "Username",
    idHint: "The username you use to log in with",
    key: "Api Key",
    keyHint: "The API key available from your <a href='https://danbooru.donmai.us/profile' target='_blank'>User Profile</a> under &quot;API Key&quot; (2nd last option under statistics)",
    requiresHash: false,
  },
}

export default {
  Sites,
  Endpoints,
  AuthDialogConfigs,
}
