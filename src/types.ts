export interface GalleryItem {
  displayer: string
  imgUrl: string
  svgUrl?: string
  labelText?: string
}

export interface UnitDetailEntry {
  id: string
  value: string | number | boolean
  valueType: string
  showInSmallPopup?: boolean
  position?: number
}

export interface UnitLevel {
  offset: number
  displayName: string
  unitLevelSlug: string
  tour360Url?: string
  floorPlans3dImgUrl?: string
  dimensionsImgUrl?: string
  imagesGallery?: GalleryItem[]
  finishesGallery?: GalleryItem[]
  unitDetail?: UnitDetailEntry[]
  vimeoVideoUrl?: string
}

export interface FilterCriterion {
  type: string
  value: string
}

export interface Unit {
  svgTargetElementId?: string
  unitSlug: string
  unitLabel: string
  unitId: number
  displayName: string
  typology?: string
  unitType: string
  downloadableBrochureUrl?: string
  unitLevels?: UnitLevel[]
  viewsGallery?: GalleryItem[]
  filterCriteria?: FilterCriterion[]
}

export interface Level {
  levelSlug: string
  order: number
  levelId: number
  displayName: string
  swipeImgUrl?: string
  swipeSvgUrl?: string
  floorPlanImgUrl?: string
  floorPlanSvgUrl?: string
  cluster?: { units: Unit[] }
}

export interface Tower {
  towerId: number
  order: number
  displayName: string
  towerSlug: string
  svgTargetElementId?: string
  cluster?: { levels: Level[] }
}

export interface StopPoint {
  stopPointSlug: string
  backgroundImgUrl: string
  backgroundSvgUrl?: string
}

export interface Tour360Item {
  tour360Url: string
  labelText: string
}

export interface ProjectStructure {
  type: string
  cluster?: { towers: Tower[] }
  spin360?: {
    initialStopPointSlug: string
    enterTransitionVideoUrl?: string
    stopPoints: StopPoint[]
    videoTransitions?: { stopPointFromSlug: string; stopPointToSlug: string; videoUrl: string }[]
  }
  generalTour360Gallery?: Tour360Item[]
  gallery?: GalleryItem[]
  availabilityGallery?: GalleryItem[]
  exteriorTour360?: { tour360Url: string }
}

export interface AvailabilityUpdate {
  unitId: number
  availabilityStatus: 'AVAILABLE' | 'RESERVED' | 'SOLD'
  availabilityColor: string
  offerType: string
  externalSKU?: string
  filterCriteria?: FilterCriterion[]
  price?: { amount: number; currencyCode: string }
}

export interface AvailabilityData {
  unitUpdates: AvailabilityUpdate[]
}

export interface ReferencePoint {
  id: number
  displayName: string
  latitude: string
  longitude: string
  isActive: boolean
  order: number
  imagePreviewUrl?: string
}

export interface LocationData {
  apiKey?: string
  latLng: string
  mapMarkerImgUrl?: string
  infoWindowContentLines?: string[]
  customMapImgUrl?: string
  additionalDetails?: {
    shortRichText?: string
    longRichText?: string
    logoImgUrl?: string
  }
  interactiveMapReferencePoints?: ReferencePoint[]
}

export interface ProjectData {
  project: {
    htmlTitle: string
    localeCodeBCP47: string
    favIconImgUrl?: string
    facebookUrl?: string
    instagramUrl?: string
    linkedinUrl?: string
    tiktokUrl?: string
    whatsAppNumber?: string
    whatsAppUrl?: string
    phoneNumber?: string
    phoneUrl?: string
    email?: string
    emailUrl?: string
    activeColor: string
    svgColor: string
    typography?: { fontFamilyName?: string }
    privacyPolicy?: string
    contentDisclaimer?: string
    projectBrochureUrl?: string
    introVimeoVideoId?: string
  }
  location: LocationData
  developer: { websiteLink?: { url: string; displayText: string } }
  menu: { logo?: { display: boolean; logoImgUrl?: string } }
  home: {
    enterButton?: { title: string }
    logo?: { display: boolean; logoImgUrl?: string; embeddedCss?: Record<string, string> }
  }
  contactPage: {
    projectName?: string
    projectDescription?: string
    contactHtmlAdditionalDetails?: string
    developerName?: string
    developerDescription?: string
    developerMapUrl?: string
  }
  videoPage?: { vimeoVideoId?: string; web3dVideoUrl?: string }
  amenitiesPage?: { gallery?: GalleryItem[]; tours360?: Tour360Item[] }
  backgroundTree?: Record<string, { imgUrl?: string; svgUrl?: string }>
  languages?: { name: string; url: string; current: boolean }[]
  projectStructure: ProjectStructure
}

export type AvailabilityStatus = AvailabilityUpdate['availabilityStatus']

export interface UnitContext {
  unit: Unit
  level: Level
  tower: Tower
  availability?: AvailabilityUpdate
}
