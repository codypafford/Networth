const getBaseUrl = () => {
  return import.meta.env.VITE_BASE_API_URI;
}

const buildQuery = (params = {}) =>
  Object.keys(params).length
    ? '?' + new URLSearchParams(params).toString()
    : ''

/**
 * Fetch with auth — must receive `getToken` from component using Auth0 hook
 */
export const fetchWithAuth = async ({
  path,
  method = 'GET',
  body = null,
  params = {},
  headers = {},
  getToken, // pass in getAccessTokenSilently
}) => {
  try {
    if (!getToken) throw new Error('Missing getToken (Auth0 token getter)')

    const token = await getToken()
    const url = `${getBaseUrl()}${path}${buildQuery(params)}`

    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body)
    }

    const res = await fetch(url, fetchOptions)

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Request failed: ${res.status} - ${err}`)
    }

    return res
  } catch (err) {
    console.error('fetchWithAuth error:', err)
    throw err
  }
}
