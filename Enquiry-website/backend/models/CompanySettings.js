import mongoose from 'mongoose'

const companySettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: 'QuickEnquiry' },
    tagline: { type: String, default: '100% Organic & Stone Ground Spices' },
    foundedYear: { type: String, default: '2014' },
    whatsappNumber: { type: String, default: '+91 9876543210' },
    contactEmail: { type: String, default: 'info@enquirybrand.com' },
    officeAddress: { type: String, default: 'Sector 62, Business Park, Noida, UP - 201309' },

    // Active Homepage Layout ('home1' | 'home2')
    activeHomepage: { type: String, default: 'home1' },

    // Header Topbar Styling Settings
    topbarBgColor: { type: String, default: '#E0F2FE' },
    topbarTextColor: { type: String, default: '#1E293B' },
    announcementText: { type: String, default: 'Free Shipping on orders over ₹499 | Premium Stone Ground Spices' },
    logoType: { type: String, default: 'icon' },
    logoText: { type: String, default: 'QuickEnquiry' },
    logoUrl: { type: String, default: '' },
    logoIconColor: { type: String, default: '#86d2a3' },

    // About Hero Section
    aboutBadge: { type: String, default: 'ABOUT QUICKENQUIRY' },
    aboutTitle: { type: String, default: 'Empowering Businesses with Seamless Product Enquiry & Trade' },
    aboutDesc: { type: String, default: 'QuickEnquiry is a premier B2B and B2C digital enquiry platform dedicated to connecting buyers directly with verified manufacturers.' },

    // Trust Stats
    statYears: { type: String, default: '12+' },
    statYearsLabel: { type: String, default: 'Years Market Trust' },
    statEnquiries: { type: String, default: '50k+' },
    statEnquiriesLabel: { type: String, default: 'Enquiries Fulfilled' },
    statSatisfaction: { type: String, default: '98.6%' },
    statSatisfactionLabel: { type: String, default: 'Customer Satisfaction' },
    statCategories: { type: String, default: '100+' },
    statCategoriesLabel: { type: String, default: 'Product Categories' },

    // Building Excellence / Story Section
    storySubtitle: { type: String, default: '— BUILDING EXCELLENCE' },
    storyTitle: { type: String, default: 'One Relationship at a Time' },
    storyImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80' },
    storyParagraph1: { type: String, default: 'Founded with a clear vision and unwavering commitment, we have grown into a trusted partner for thousands of clients across the country.' },
    storyParagraph2: { type: String, default: 'From our very first day, we believed that exceptional service is not a luxury — it is a standard.' },

    // Mission & Vision
    missionHeading: { type: String, default: 'Empowering Businesses & Delivering Excellence' },
    missionText: { type: String, default: 'Our mission is to deliver exceptional, personalised services that solve real problems, create genuine value, and help each client grow with confidence.' },
    missionPoints: {
      type: [String],
      default: [
        'Deliver measurable results with every engagement',
        'Foster long-term partnerships built on trust',
        'Continuously improve through client feedback',
        'Make excellence accessible to businesses of all sizes'
      ]
    },
    missionPoint1: { type: String, default: 'Deliver measurable results with every engagement' },
    missionPoint2: { type: String, default: 'Foster long-term partnerships built on trust' },
    missionPoint3: { type: String, default: 'Continuously improve through client feedback' },
    missionPoint4: { type: String, default: 'Make excellence accessible to businesses of all sizes' },

    visionHeading: { type: String, default: 'A Future Where Quality Is Never Compromised' },
    visionText: { type: String, default: 'We envision a world where every individual and organisation has access to world-class service — regardless of size or scale.' },
    visionPoints: {
      type: [String],
      default: [
        'Become the most trusted name in our industry',
        'Lead innovation without losing the human touch',
        'Scale our impact across communities and sectors',
        'Build a legacy of excellence for future generations'
      ]
    },
    visionPoint1: { type: String, default: 'Become the most trusted name in our industry' },
    visionPoint2: { type: String, default: 'Lead innovation without losing the human touch' },
    visionPoint3: { type: String, default: 'Scale our impact across communities and sectors' },
    visionPoint4: { type: String, default: 'Build a legacy of excellence for future generations' },

    // Our DNA Core Values
    dnaSubtitle: { type: String, default: '— OUR DNA —' },
    dnaTitle: { type: String, default: 'The Values That Define Us' },
    dnaCards: {
      type: [
        {
          title: { type: String },
          desc: { type: String }
        }
      ],
      default: [
        {
          title: 'Integrity',
          desc: 'We say what we mean and do what we say. Honesty is the foundation of every relationship we build.'
        },
        {
          title: 'Innovation',
          desc: 'We embrace change, challenge convention, and constantly seek better ways to serve our clients.'
        },
        {
          title: 'Empathy',
          desc: 'We understand that behind every enquiry is a person. Compassion shapes every interaction we have.'
        },
        {
          title: 'Excellence',
          desc: 'Good enough is never enough. We hold ourselves to the highest standard in every single task.'
        }
      ]
    },
    dnaCard1Title: { type: String, default: 'Integrity' },
    dnaCard1Desc: { type: String, default: 'We say what we mean and do what we say. Honesty is the foundation of every relationship we build.' },
    dnaCard2Title: { type: String, default: 'Innovation' },
    dnaCard2Desc: { type: String, default: 'We embrace change, challenge convention, and constantly seek better ways to serve our clients.' },
    dnaCard3Title: { type: String, default: 'Empathy' },
    dnaCard3Desc: { type: String, default: 'We understand that behind every enquiry is a person. Compassion shapes every interaction we have.' },
    dnaCard4Title: { type: String, default: 'Excellence' },
    dnaCard4Desc: { type: String, default: 'Good enough is never enough. We hold ourselves to the highest standard in every single task.' }
  },
  { timestamps: true }
)

const CompanySettings = mongoose.model('CompanySettings', companySettingsSchema)

export default CompanySettings
