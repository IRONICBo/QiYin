import dayjs from 'dayjs'

export default {
  $sleep(duration) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, duration)
    })
  },
  $parseURL(url) {
    const a = document.createElement('a')
    a.href = url
    return {
      host: a.hostname,
      port: a.port,
      query: a.search,
      params: (function () {
        const ret = {}
        const seg = a.search.replace(/^\?/, '')
            .split('&')
        const len = seg.length
        let i = 0
        let s
        for (; i < len; i++) {
          if (!seg[i]) {
            continue
          }
          s = seg[i].split('=')
          ret[s[0]] = s[1]
        }
        return ret
      }()),
      hash: a.hash.replace('#', ''),
    }
  },
  $storageClear(key, isAll = false) {
    if (isAll) {
      localStorage.clear()
    } else {
      localStorage.removeItem(key)
    }
  },

  $dateFormat(val, type) {
    if (!val) return
    if (typeof val === 'number') {

    } else {
      if (val.length === 10) {
        val += '000'
      }
      if (typeof val === 'string' && (val.length === 10 || val.length === 13)) {
        val = Number(val)
      }
    }
    switch (type) {
      case 'Y':
        return dayjs(val).format('YYYY')
      case 'M':
        return dayjs(val).format('YYYY-MM')
      case 'M_CN':
        return dayjs(val).format('YYYY年MM月')
      case 'D':
        return dayjs(val).format('YYYY-MM-DD')
      case 'm':
        return dayjs(val).format('YYYY-MM-DD HH:mm')
      case 'S':
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      default:
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  $time(time) {
    let date = new dayjs(time)
    let now = new dayjs()
    let d = now.valueOf() - date.valueOf()
    let str = ''
    if (d < 1000 * 60) {
      str = '刚刚'
    } else if (d < 1000 * 60 * 60) {
      str = `${(d / (1000 * 60)).toFixed()}分钟前`
    } else if (d < 1000 * 60 * 60 * 24) {
      str = `${(d / (1000 * 60 * 60)).toFixed()}小时前`
    } else if (d < 1000 * 60 * 60 * 24 * 2) {
      str = '1天前'
    } else if (d < 1000 * 60 * 60 * 24 * 3) {
      str = '2天前'
    } else if (d < 1000 * 60 * 60 * 24 * 4) {
      str = '3天前'
    } else if (date.isSame(now, 'year')) {
      str = dayjs(time).format('MM-DD')
    } else {
      str = dayjs(time).format('YYYY-MM-DD')
    }
    return str
  },
  $duration(v) {
    if (!v) return '00:00'
    let m = Math.floor(v / 60)
    // let s = v % 60
    let s = Math.round(v % 60)
    let str = ''
    if (m === 0) {
      str = '00'
    } else if (m > 0 && m < 10) {
      str = '0' + m
    } else {
      str = m
    }
    str += ':'
    if (s === 0) {
      str += '00'
    } else if (s > 0 && s < 10) {
      str += '0' + s
    } else {
      str += s
    }
    return str
  },
  formatNumber(num) {
    if (!num) return
    if (num > 100000000) {
      return (num / 100000000).toFixed(1) + '亿'
    } else if (num > 10000) {
      return (num / 10000).toFixed(1) + '万'
    } else {
      return num
    }
  }
}
