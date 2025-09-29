import type { MaybeRef, MaybeRefOrGetter, useFetch } from '@vueuse/core'
import type { useRouter } from 'vue-router'
import { createFetch } from '@vueuse/core'
import { computed, reactive, unref } from 'vue'

class ApiService {
  static cache: any = []
  static $fetch: typeof useFetch

  static init(router: ReturnType<typeof useRouter>) {
    this.$fetch = createFetch({
      baseUrl: '/api',
      options: {
        timeout: 0,
        beforeFetch(ctx) {
          return ctx
        },
        afterFetch(ctx) {
          return ctx
        },
        onFetchError(ctx) {
          if (ctx.error.code === 20) {
            return ctx
          }
          if (ctx.response?.status === 403) {
            router.push({
              path: '/403',
              query: { message: ctx.error.message },
            })
            return ctx
          }
          if (ctx.response?.status === 404) {
            router.push({
              path: '/404',
              query: { message: ctx.data.message },
            })
            return ctx
          }
          return ctx
        },
      },
    })
  }

  static buildUrlWithParams(url: string, params: Record<string, any> = {}) {
    return computed(() => {
      const _params = Object.entries(reactive(params))
        .reduce((params: URLSearchParams, [key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(x => params.append(key, x))
            return params
          }
          if (value !== undefined) {
            params.append(key, value)
          }
          return params
        }, new URLSearchParams())
      return `${url}?${_params}`
    })
  }

  static get<T = any>(_resource: string, params?: Record<string, any>) {
    const resource = unref(_resource)

    if (!params) {
      return ApiService.$fetch<T>(resource, { refetch: true }).get().json<T>()
    }

    const _url = ApiService.buildUrlWithParams(resource, params)
    return ApiService.$fetch<T>(_url, { refetch: true }).get().json<T>()
  }

  static post<T>(resource: string, body?: MaybeRefOrGetter<T>) {
    return ApiService.$fetch(resource).post(body).json<T>()
  }

  /**
   * 封装 put 请求
   * @param url 请求地址
   * @param payload 请求参数
   */
  static put<T = unknown>(
    url: MaybeRef<string>,
    payload?: MaybeRef<unknown>,
  ) {
    return ApiService.$fetch<T>(url).put(payload).json()
  }

  /**
   * 封装 delete 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param payload 请求参数
   */
  static delete<T = unknown>(
    url: MaybeRef<string>,
    params?: Record<string, any>,
    payload?: MaybeRef<unknown>,
  ) {
    const resource = unref(url)
    const _url = ApiService.buildUrlWithParams(resource, params)
    return ApiService.$fetch<T>(_url).delete(payload).json()
  }

  /**
   * 封装获取Blob进行下载
   * @param url 请求地址
   */
  static blob(url: MaybeRef<string>) {
    return ApiService.$fetch(url).blob()
  }

  /**
   * 封装 patch 请求
   * @param url 请求地址
   * @param payload 请求参数
   */
  static patch<T = unknown>(url: MaybeRef<string>, payload?: MaybeRef<unknown>) {
    return ApiService.$fetch<T>(url).patch(payload).json()
  }
}

export { ApiService }
