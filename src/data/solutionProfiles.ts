export type RouteOption = {
  value: string;
  label: string;
  insight: string;
};

export type RouteQuestion = {
  id: string;
  question: string;
  help: string;
  options: RouteOption[];
};

export type SolutionProfile = {
  formMineral: 'alluvial_gold' | 'hard_rock_gold' | 'tin' | 'tungsten' | 'chrome' | 'other';
  heroPrompt: string;
  reviewerIntro: string;
  suitableFor: string[];
  routeMayChangeWhen: string[];
  diagnosticQuestions: RouteQuestion[];
  verificationNeeds: string[];
  relatedProjects: string[];
  proofImage?: {
    src: string;
    alt: string;
    caption: string;
  };
};

const unknown = (insight: string): RouteOption => ({
  value: 'unknown',
  label: 'I do not know yet',
  insight,
});

export const solutionProfiles: Record<string, SolutionProfile> = {
  'alluvial-gold': {
    formMineral: 'alluvial_gold',
    heroPrompt: 'Clay content, feed size and gold particle size determine the washing and recovery circuit.',
    reviewerIntro:
      'We check whether washing and screening can deliver a clean, correctly sized feed to the gravity circuit.',
    suitableFor: [
      'Placer, river, beach or eluvial material containing liberated gold',
      'New wash plants and existing lines that are losing gold in a known size fraction',
      'Projects where washing, screening, water and tailings conditions can be defined',
    ],
    routeMayChangeWhen: [
      'Sticky clay does not disperse during simple washing',
      'A meaningful share of the gold is very fine or attached to other minerals',
      'Water supply or settling area cannot support the proposed washing duty',
    ],
    diagnosticQuestions: [
      {
        id: 'clay',
        question: 'How does the wet feed break apart?',
        help: 'Clay behavior decides whether simple washing is enough or a scrubber-first route needs testing.',
        options: [
          {
            value: 'free-washing',
            label: 'Gravel separates easily in water',
            insight: 'A controlled feed, screening and staged gravity route may be sufficient before fine-gold scavenging is considered.',
          },
          {
            value: 'sticky-clay',
            label: 'Sticky clay forms balls or coatings',
            insight: 'Clay dispersion and scrubber retention time must be checked before selecting the recovery equipment.',
          },
          {
            value: 'mixed',
            label: 'Clay changes across the deposit',
            insight: 'The wash section should be designed for feed variability, not only the easiest material.',
          },
          unknown('Representative wet-feed photos or a simple washing test are needed to define the washing duty.'),
        ],
      },
      {
        id: 'feed-size',
        question: 'What is the largest regular feed size?',
        help: 'Oversize handling protects the washer and prevents unstable feed surges.',
        options: [
          {
            value: 'below-50',
            label: 'Mostly below 50 mm',
            insight: 'The feed may need controlled screening rather than a heavy boulder-removal stage.',
          },
          {
            value: '50-150',
            label: 'Regular 50-150 mm stones',
            insight: 'A grizzly, trommel or screen duty must be sized around the real oversize rate and clay load.',
          },
          {
            value: 'above-150',
            label: 'Boulders above 150 mm are common',
            insight: 'Pre-screening, excavator feeding and oversize disposal become part of the plant scope.',
          },
          unknown('A feed-size photo with a scale and an estimated oversize percentage will be requested.'),
        ],
      },
      {
        id: 'gold-size',
        question: 'What is known about the gold particle size?',
        help: 'Visible coarse gold and fine liberated gold require different recovery duties and sampling care.',
        options: [
          {
            value: 'coarse-visible',
            label: 'Mostly visible or coarse gold',
            insight: 'Coarse recovery can be protected early, but the fine fractions still need checking before they are discarded.',
          },
          {
            value: 'mixed',
            label: 'A mix of coarse and fine gold',
            insight: 'Classification and separate recovery duties are likely to be more reliable than one separator treating the full range.',
          },
          {
            value: 'fine',
            label: 'Fine gold is the main concern',
            insight: 'Fine-gold recovery must be assessed after effective clay dispersion and narrow size classification.',
          },
          unknown('A size-by-size test or representative panning observations are needed before fine-gold equipment is named.'),
        ],
      },
    ],
    verificationNeeds: [
      'Representative feed photos and clay behavior in water',
      'Feed-size distribution and estimated oversize rate',
      'Gold distribution by size where test data is available',
      'Target dry TPH, operating hours, water source and tailings plan',
    ],
    relatedProjects: [
      'romania-20tph-alluvial-gold-gravity-reference',
      'east-africa-200tph-alluvial-gold-reference',
    ],
    proofImage: {
      src: '/images/factory/gold-trommel-workshop.webp',
      alt: 'Large gold trommel being assembled in a mineral processing workshop',
      caption: 'Trommel under assembly in our Jiangxi workshop. Drum size and screen openings are selected from feed, clay and water conditions.',
    },
  },
  'hard-rock-gold': {
    formMineral: 'hard_rock_gold',
    heroPrompt: 'Gold association and liberation determine the crushing, grinding and recovery circuit.',
    reviewerIntro:
      'We separate free-gold opportunities from sulphide-associated or refractory risks before recommending equipment.',
    suitableFor: [
      'Primary or weathered rock where crushing and grinding duties need definition',
      'Projects assessing gravity recovery inside a controlled grinding circuit',
      'Existing plants with known recovery, liberation or circulating-load problems',
    ],
    routeMayChangeWhen: [
      'Gold is mainly locked in sulphides or fine mineral associations',
      'The required liberation size is unknown or based only on visual inspection',
      'Flotation or leaching may be necessary to treat gravity tailings',
    ],
    diagnosticQuestions: [
      {
        id: 'association',
        question: 'What is known about where the gold occurs?',
        help: 'Gold association determines whether gravity is a recovery stage or only one part of a wider route.',
        options: [
          {
            value: 'free-gold',
            label: 'Visible or test-confirmed free gold',
            insight: 'Early gravity recovery may remove liberated gold before it accumulates in the grinding circuit.',
          },
          {
            value: 'sulphide',
            label: 'Gold appears related to sulphides',
            insight: 'Gravity alone should not be treated as a complete route; flotation or leach test work may be required.',
          },
          {
            value: 'mixed',
            label: 'Both free gold and sulphides occur',
            insight: 'A combined route may recover free gold early while testing the remaining sulphide-bearing fraction separately.',
          },
          unknown('Mineralogy, GRG work or staged recovery tests are needed before a downstream route is selected.'),
        ],
      },
      {
        id: 'preparation',
        question: 'What preparation equipment already exists?',
        help: 'A new plant and an upgrade project have different scope, controls and integration risks.',
        options: [
          {
            value: 'none',
            label: 'No crushing or grinding circuit yet',
            insight: 'The review must cover staged crushing, grind duty, classification, water and power as one balanced circuit.',
          },
          {
            value: 'crushing',
            label: 'Crushing exists, grinding does not',
            insight: 'Existing crusher product size and variability must be checked before a grinding duty is sized.',
          },
          {
            value: 'grinding',
            label: 'A grinding circuit already operates',
            insight: 'Sampling points, circulating load and the best gravity take-off stream should be reviewed before adding equipment.',
          },
          unknown('Photos, equipment plates and a simple existing-flowsheet sketch will define the integration scope.'),
        ],
      },
      {
        id: 'liberation',
        question: 'How was the target grind size chosen?',
        help: 'Grinding finer by habit raises power and slime losses without proving better gold recovery.',
        options: [
          {
            value: 'tested',
            label: 'Supported by liberation or recovery tests',
            insight: 'Equipment sizing can be tied to the tested grind, hardness and intended operating schedule.',
          },
          {
            value: 'observed',
            label: 'Estimated from visible gold or panning',
            insight: 'The estimate is useful for screening, but it should not be treated as the final mill product specification.',
          },
          {
            value: 'existing',
            label: 'Inherited from an existing circuit',
            insight: 'Size-by-size recovery and tailings data should confirm whether the current grind is justified.',
          },
          unknown('A staged grind-and-recovery test is the practical next step before mill sizing.'),
        ],
      },
    ],
    verificationNeeds: [
      'Assays, mineral observations and any GRG or recovery test results',
      'Maximum feed size, target grind and ore hardness information',
      'Existing equipment, circulating-load and tailings data where applicable',
      'Target TPH, power, water, operating hours and downstream product plan',
    ],
    relatedProjects: [
      'australia-30tph-rock-gold-fine-gold-reference',
      'malaysia-50tph-rock-gold-line-reference',
    ],
    proofImage: {
      src: '/images/factory/rock-gold-field-installation.webp',
      alt: 'Rock gold processing equipment installed at a project site',
      caption: 'Field reference: the equipment layout follows the selected crushing, grinding and recovery duties.',
    },
  },
  tin: {
    formMineral: 'tin',
    heroPrompt: 'Placer and hard-rock tin ores require different front-end treatment and liberation steps.',
    reviewerIntro:
      'We check cassiterite liberation, fragility and fine losses before selecting jigs, spirals or tables.',
    suitableFor: [
      'Placer tin requiring washing, classification and staged gravity recovery',
      'Rock tin where crushing, selective grinding and early coarse recovery need review',
      'Existing circuits losing cassiterite to slimes or mixed middlings',
    ],
    routeMayChangeWhen: [
      'The valuable mineral is not confirmed as cassiterite',
      'Fine tin losses dominate after aggressive washing or grinding',
      'Sulphides or magnetic minerals prevent a saleable concentrate',
    ],
    diagnosticQuestions: [
      {
        id: 'deposit',
        question: 'Is the feed placer material or rock ore?',
        help: 'This decides whether the first duty is washing or controlled size reduction.',
        options: [
          { value: 'placer', label: 'Placer or alluvial tin', insight: 'Washing, classification and early coarse recovery are the likely first duties.' },
          { value: 'rock', label: 'Primary or weathered rock tin', insight: 'Staged crushing or grinding must liberate cassiterite without creating unnecessary slimes.' },
          { value: 'tailings', label: 'Existing tailings or middlings', insight: 'Representative size-by-size sampling is needed before a retreatment route is proposed.' },
          unknown('Mineral identification and representative feed photos will establish the correct preparation route.'),
        ],
      },
      {
        id: 'size',
        question: 'Where is most of the tin reporting by size?',
        help: 'Cassiterite is dense but brittle; coarse recovery and fine-loss control must be balanced.',
        options: [
          { value: 'coarse', label: 'Mainly coarse liberated grains', insight: 'Recovering coarse cassiterite early can reduce breakage and circulating load.' },
          { value: 'broad', label: 'Spread across coarse and fine sizes', insight: 'Narrow classification and separate gravity duties are likely to improve control.' },
          { value: 'fine', label: 'Fine tin or slime losses dominate', insight: 'Fine-fraction testing is needed before conventional gravity equipment is assumed to be economic.' },
          unknown('Size-by-size assays will show whether the current loss is washing, liberation or fine recovery.'),
        ],
      },
      {
        id: 'concentrate',
        question: 'What prevents the gravity product from being saleable?',
        help: 'Concentrate cleaning depends on the actual associated heavy minerals.',
        options: [
          { value: 'clean', label: 'Gravity concentrate is already clean', insight: 'The review can focus on mass recovery, stability and loss reduction.' },
          { value: 'magnetic', label: 'Magnetic minerals are mixed in', insight: 'Magnetic cleaning may be useful, but only after mineral identification and staged tests.' },
          { value: 'sulphide', label: 'Sulphides or other heavy minerals remain', insight: 'Additional cleaning must be tested against the required concentrate specification.' },
          unknown('A concentrate assay and mineral check are needed before adding another separator.'),
        ],
      },
    ],
    verificationNeeds: [
      'Cassiterite identification and placer, rock or tailings source',
      'Size-by-size tin assays and current loss points',
      'Associated magnetic minerals, sulphides and product specification',
      'Target TPH, feed moisture, water, power and existing equipment',
    ],
    relatedProjects: ['tanzania-10tph-tin-tungsten-gravity-reference'],
    proofImage: {
      src: '/images/factory/jig-machine-workshop.webp',
      alt: 'Jig machines assembled for classified gravity concentration duties',
      caption: 'Workshop reference: a jig duty is selected from liberation and classified feed size, not mineral name alone.',
    },
  },
  tungsten: {
    formMineral: 'tungsten',
    heroPrompt: 'Tungsten design starts by identifying the mineral and protecting it from overgrinding.',
    reviewerIntro:
      'We distinguish wolframite, scheelite and mixed ore, then check where fine losses and cleaning limits occur.',
    suitableFor: [
      'Placer or rock tungsten with defined mineral identity and gravity response',
      'Circuits that can recover liberated coarse tungsten before selective regrinding',
      'Existing plants reviewing middlings, fine losses or concentrate cleaning',
    ],
    routeMayChangeWhen: [
      'Scheelite or mixed mineralogy makes a gravity-only route incomplete',
      'A large share of tungsten reports to slimes or very fine sizes',
      'Sulphides and impurities require additional cleaning stages',
    ],
    diagnosticQuestions: [
      {
        id: 'mineral',
        question: 'Which tungsten mineral is present?',
        help: 'Wolframite and scheelite can share gravity stages but do not create identical cleaning routes.',
        options: [
          { value: 'wolframite', label: 'Mainly wolframite', insight: 'Staged gravity recovery and magnetic cleaning may be assessed from the tested mineral assemblage.' },
          { value: 'scheelite', label: 'Mainly scheelite', insight: 'Fine scheelite or complex gangue may require flotation testing beyond gravity recovery.' },
          { value: 'mixed', label: 'Mixed wolframite and scheelite', insight: 'The route must account for different mineral behavior and final concentrate requirements.' },
          unknown('Mineral identification is required before a gravity and cleaning sequence is proposed.'),
        ],
      },
      {
        id: 'source',
        question: 'Is this placer material, rock ore or retreatment feed?',
        help: 'The answer changes washing, liberation and representative sampling requirements.',
        options: [
          { value: 'placer', label: 'Placer material', insight: 'Washing and classified gravity recovery are the likely starting duties.' },
          { value: 'rock', label: 'Rock ore', insight: 'Stage reduction, early recovery and selective middlings regrinding should be reviewed together.' },
          { value: 'retreatment', label: 'Tailings or middlings', insight: 'Size-by-size assays and mass inventory are needed before retreatment equipment is sized.' },
          unknown('Representative feed photos, mineral identification and size data will define the preparation route.'),
        ],
      },
      {
        id: 'loss',
        question: 'Where is tungsten currently being lost?',
        help: 'The loss location distinguishes liberation, classification and separator problems.',
        options: [
          { value: 'coarse', label: 'Coarse composites or tailings', insight: 'Incomplete liberation or misplaced coarse particles should be checked before adding fine-recovery equipment.' },
          { value: 'middlings', label: 'Middlings build up in the circuit', insight: 'Selective regrinding may be more useful than grinding the full feed finer.' },
          { value: 'fine', label: 'Fine tailings or slimes', insight: 'Fine-fraction test work is needed to define realistic gravity or flotation opportunities.' },
          unknown('Sampling concentrate, middlings and tailings by size is the practical first diagnostic step.'),
        ],
      },
    ],
    verificationNeeds: [
      'Tungsten mineral identity and associated sulphides or impurities',
      'Liberation observations and size-by-size WO3 assays',
      'Current concentrate, middlings and tailings information',
      'Target TPH, water, power, operating schedule and product specification',
    ],
    relatedProjects: ['tanzania-10tph-tin-tungsten-gravity-reference'],
    proofImage: {
      src: '/images/factory/shaking-table-workshop.webp',
      alt: 'Shaking tables prepared in a mineral processing workshop',
      caption: 'Workshop reference: tables clean controlled fractions; they do not replace liberation and classification.',
    },
  },
  chrome: {
    formMineral: 'chrome',
    heroPrompt: 'Chromite mineralogy, liberation and the target Cr/Fe ratio determine the separation circuit.',
    reviewerIntro:
      'We check whether the feed is primary ore, placer material or old tailings, then review clay, size and buyer specification.',
    suitableFor: [
      'Chromite ore or tailings with representative grade and size information',
      'Projects requiring washing, classification and staged gravity assessment',
      'Existing lines reviewing slime losses, middlings or product quality',
    ],
    routeMayChangeWhen: [
      'Chromite is not sufficiently liberated at the proposed feed size',
      'Cr/Fe ratio or impurity limits matter more than Cr2O3 grade alone',
      'Fine slimes dominate the remaining chromite inventory',
    ],
    diagnosticQuestions: [
      {
        id: 'source',
        question: 'What type of chrome feed is being treated?',
        help: 'Primary ore, placer feed and old tailings require different preparation and sampling.',
        options: [
          { value: 'primary', label: 'Primary or weathered ore', insight: 'Liberation testing should determine whether crushing or grinding is needed before gravity separation.' },
          { value: 'placer', label: 'Sand or placer chromite', insight: 'Washing, desliming and classified spiral roughing may be a practical starting route.' },
          { value: 'tailings', label: 'Old tailings or stockpiles', insight: 'Representative drilling or grid sampling and a mass inventory are needed before retreatment sizing.' },
          unknown('Feed history, representative photos and size-by-size assays will define the first test route.'),
        ],
      },
      {
        id: 'clay',
        question: 'How much clay or ultrafine slime is present?',
        help: 'Slimes change slurry behavior and can carry fine chromite into tailings or concentrate.',
        options: [
          { value: 'low', label: 'Low clay and stable sand feed', insight: 'The main review can focus on classification, roughing and cleaning duties.' },
          { value: 'moderate', label: 'Clay is visible but washable', insight: 'Washing and controlled desliming should be tested before the gravity stages are sized.' },
          { value: 'high', label: 'High slime or weathered feed', insight: 'Water, thickening and fine-chromite losses may control the flowsheet economics.' },
          unknown('A wet screen test and size-by-size assay will show how much chromite follows the slimes.'),
        ],
      },
      {
        id: 'product',
        question: 'What product requirement is already known?',
        help: 'A useful chrome concentrate is defined by more than one head-grade number.',
        options: [
          { value: 'full-spec', label: 'Cr2O3, Cr/Fe and size are specified', insight: 'Cleaning duty and mass pull can be tested against a defined buyer target.' },
          { value: 'grade-only', label: 'Only a Cr2O3 target is known', insight: 'Cr/Fe ratio, impurities and product size still need confirmation before a saleable route is defined.' },
          { value: 'upgrade', label: 'The goal is only to upgrade existing feed', insight: 'Test results should report grade, recovery and yield together to avoid a misleading upgrade claim.' },
          unknown('The buyer or downstream plant specification should be confirmed before final cleaning equipment is selected.'),
        ],
      },
    ],
    verificationNeeds: [
      'Feed source, representative grade and size-by-size Cr2O3 results',
      'Liberation, clay and slime distribution',
      'Required Cr2O3, Cr/Fe ratio, product size and impurity limits',
      'Available tonnage, target TPH, water, tailings area and power',
    ],
    relatedProjects: [],
    proofImage: {
      src: '/images/factory/screen-loading-delivery.webp',
      alt: 'Industrial screening equipment prepared for loading and delivery',
      caption: 'Delivery reference: screen duty and aperture are confirmed from the required size split and solids load.',
    },
  },
  'more-minerals': {
    formMineral: 'other',
    heroPrompt: 'Mineral identity, liberation and density contrast determine whether gravity concentration is suitable.',
    reviewerIntro:
      'We check whether the valuable mineral can be identified, liberated and concentrated at a workable mass pull.',
    suitableFor: [
      'Tantalum-niobium, manganese, ilmenite, zircon and other heavy-mineral enquiries',
      'Projects with representative assays, mineral observations or an existing test history',
      'Early reviews intended to decide whether gravity testing is justified',
    ],
    routeMayChangeWhen: [
      'The valuable mineral or saleable product is not yet identified',
      'Liberation requires excessive grinding or valuable mineral reports to slimes',
      'Another physical or chemical process is more appropriate than gravity',
    ],
    diagnosticQuestions: [
      {
        id: 'identity',
        question: 'How was the valuable mineral identified?',
        help: 'A visual heavy fraction is not enough to design a process route.',
        options: [
          { value: 'assay-mineralogy', label: 'Assay and mineralogy are available', insight: 'The review can connect mineral identity, size and likely separation methods.' },
          { value: 'assay', label: 'Only assays are available', insight: 'Mineral identification may still be needed before a physical separation route is selected.' },
          { value: 'visual', label: 'Based on visual or panning observations', insight: 'The observation is useful for sampling, but should not be used as the final mineral identity.' },
          unknown('A representative assay and mineral check are the first practical requirements.'),
        ],
      },
      {
        id: 'liberation',
        question: 'At what size is the valuable mineral liberated?',
        help: 'Gravity response depends on liberated particles in controllable size ranges.',
        options: [
          { value: 'coarse', label: 'Liberated in coarse or sand sizes', insight: 'Classified gravity testing may be justified before a plant route is proposed.' },
          { value: 'fine', label: 'Mainly fine or slime-sized', insight: 'Fine-particle recovery and dewatering may control whether gravity is practical.' },
          { value: 'composite', label: 'Mostly locked or composite', insight: 'A staged liberation test should come before separator selection.' },
          unknown('Size-by-size mineral and assay information will define the first test fractions.'),
        ],
      },
      {
        id: 'product',
        question: 'What product is the project trying to make?',
        help: 'A heavy concentrate is useful only when it has a defined downstream use or buyer specification.',
        options: [
          { value: 'spec', label: 'A buyer specification is available', insight: 'Testing can report grade, recovery and mass pull against a defined product target.' },
          { value: 'preconcentrate', label: 'A pre-concentrate for further treatment', insight: 'The review should define mass rejection and downstream compatibility rather than final concentrate grade alone.' },
          { value: 'exploration', label: 'The target product is still being explored', insight: 'A staged test program is more appropriate than an equipment quotation.' },
          unknown('The intended downstream use must be clarified before a complete plant scope is prepared.'),
        ],
      },
    ],
    verificationNeeds: [
      'Representative assay and mineral identification',
      'Feed and valuable-mineral size distribution',
      'Gravity or magnetic test response where available',
      'Target product, capacity, country, water and power conditions',
    ],
    relatedProjects: [],
  },
};

export function getSolutionProfile(slug: string): SolutionProfile {
  const profile = solutionProfiles[slug];
  if (!profile) throw new Error(`Missing solution profile for ${slug}`);
  return profile;
}
