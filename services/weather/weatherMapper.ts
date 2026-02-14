/**
 * 天气代码映射器
 * 将不同天气 API 的代码映射到统一的天气类型
 */

import { WeatherType } from './weatherTypes';

/**
 * 和风天气代码映射
 * @see https://dev.qweather.com/docs/resource/icons/
 */
const QWEATHER_CODE_MAP: Record<string, WeatherType> = {
  // 晴天
  '100': WeatherType.SUNNY,
  '150': WeatherType.SUNNY,

  // 多云
  '101': WeatherType.CLOUDY,
  '102': WeatherType.CLOUDY,
  '103': WeatherType.CLOUDY,
  '104': WeatherType.CLOUDY,
  '151': WeatherType.CLOUDY,
  '152': WeatherType.CLOUDY,
  '153': WeatherType.CLOUDY,

  // 雨天
  '300': WeatherType.RAINY,
  '301': WeatherType.RAINY,
  '302': WeatherType.RAINY,
  '303': WeatherType.RAINY,
  '304': WeatherType.RAINY,
  '305': WeatherType.RAINY,
  '306': WeatherType.RAINY,
  '307': WeatherType.RAINY,
  '308': WeatherType.RAINY,
  '309': WeatherType.RAINY,
  '310': WeatherType.RAINY,
  '311': WeatherType.RAINY,
  '312': WeatherType.RAINY,
  '313': WeatherType.RAINY,
  '314': WeatherType.RAINY,
  '315': WeatherType.RAINY,
  '316': WeatherType.RAINY,
  '317': WeatherType.RAINY,
  '318': WeatherType.RAINY,
  '350': WeatherType.RAINY,
  '351': WeatherType.RAINY,
  '399': WeatherType.RAINY,

  // 雪天
  '400': WeatherType.SNOWY,
  '401': WeatherType.SNOWY,
  '402': WeatherType.SNOWY,
  '403': WeatherType.SNOWY,
  '404': WeatherType.SNOWY,
  '405': WeatherType.SNOWY,
  '406': WeatherType.SNOWY,
  '407': WeatherType.SNOWY,
  '408': WeatherType.SNOWY,
  '409': WeatherType.SNOWY,
  '410': WeatherType.SNOWY,
  '456': WeatherType.SNOWY,
  '457': WeatherType.SNOWY,
  '499': WeatherType.SNOWY,

  // 雾霾
  '500': WeatherType.FOGGY,
  '501': WeatherType.FOGGY,
  '502': WeatherType.FOGGY,
  '503': WeatherType.FOGGY,
  '504': WeatherType.FOGGY,
  '507': WeatherType.FOGGY,
  '508': WeatherType.FOGGY,
  '509': WeatherType.FOGGY,
  '510': WeatherType.FOGGY,
  '511': WeatherType.FOGGY,
  '512': WeatherType.FOGGY,
  '513': WeatherType.FOGGY,
  '514': WeatherType.FOGGY,
  '515': WeatherType.FOGGY,
  '800': WeatherType.FOGGY,
  '801': WeatherType.FOGGY,
  '802': WeatherType.FOGGY,
  '803': WeatherType.FOGGY,
  '804': WeatherType.FOGGY,
  '805': WeatherType.FOGGY,
  '806': WeatherType.FOGGY,
  '807': WeatherType.FOGGY,
  '808': WeatherType.FOGGY,
  '809': WeatherType.FOGGY,
  '810': WeatherType.FOGGY,
  '811': WeatherType.FOGGY,
  '812': WeatherType.FOGGY,
  '813': WeatherType.FOGGY,

  // 大风
  '901': WeatherType.WINDY,
  '902': WeatherType.WINDY,
  '903': WeatherType.WINDY,
  '904': WeatherType.WINDY,
  '905': WeatherType.WINDY,
  '906': WeatherType.WINDY,
  '907': WeatherType.WINDY,
  '908': WeatherType.WINDY,
  '909': WeatherType.WINDY,
  '910': WeatherType.WINDY,

  // 沙尘
  '505': WeatherType.SANDSTORM,
  '506': WeatherType.SANDSTORM,
};

/**
 * OpenWeatherMap 天气 ID 映射
 * @see https://openweathermap.org/weather-conditions
 */
const OPENWEATHER_ID_MAP: Record<number, WeatherType> = {
  // 晴天
  800: WeatherType.SUNNY,

  // 多云
  801: WeatherType.CLOUDY,
  802: WeatherType.CLOUDY,
  803: WeatherType.CLOUDY,
  804: WeatherType.CLOUDY,

  // 雨天
  300: WeatherType.RAINY,
  301: WeatherType.RAINY,
  302: WeatherType.RAINY,
  310: WeatherType.RAINY,
  311: WeatherType.RAINY,
  312: WeatherType.RAINY,
  313: WeatherType.RAINY,
  314: WeatherType.RAINY,
  321: WeatherType.RAINY,
  500: WeatherType.RAINY,
  501: WeatherType.RAINY,
  502: WeatherType.RAINY,
  503: WeatherType.RAINY,
  504: WeatherType.RAINY,
  511: WeatherType.RAINY,
  520: WeatherType.RAINY,
  521: WeatherType.RAINY,
  522: WeatherType.RAINY,
  531: WeatherType.RAINY,

  // 雪天
  600: WeatherType.SNOWY,
  601: WeatherType.SNOWY,
  602: WeatherType.SNOWY,
  611: WeatherType.SNOWY,
  612: WeatherType.SNOWY,
  613: WeatherType.SNOWY,
  615: WeatherType.SNOWY,
  616: WeatherType.SNOWY,
  620: WeatherType.SNOWY,
  621: WeatherType.SNOWY,
  622: WeatherType.SNOWY,

  // 雾霾
  701: WeatherType.FOGGY,
  711: WeatherType.FOGGY,
  721: WeatherType.FOGGY,
  731: WeatherType.FOGGY,
  741: WeatherType.FOGGY,
  751: WeatherType.SANDSTORM,
  761: WeatherType.SANDSTORM,
  762: WeatherType.FOGGY,
  771: WeatherType.WINDY,
  781: WeatherType.WINDY,

  // 大风
  200: WeatherType.WINDY,
  201: WeatherType.WINDY,
  202: WeatherType.WINDY,
  210: WeatherType.WINDY,
  211: WeatherType.WINDY,
  212: WeatherType.WINDY,
  221: WeatherType.WINDY,
  230: WeatherType.WINDY,
  231: WeatherType.WINDY,
  232: WeatherType.WINDY,
};

/**
 * 从和风天气代码映射到天气类型
 */
export const mapQWeatherCode = (code: string): WeatherType => {
  return QWEATHER_CODE_MAP[code] || WeatherType.SUNNY;
};

/**
 * 从 OpenWeatherMap ID 映射到天气类型
 */
export const mapOpenWeatherId = (id: number): WeatherType => {
  return OPENWEATHER_ID_MAP[id] || WeatherType.SUNNY;
};