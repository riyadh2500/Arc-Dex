'use client'

// ARC DEX — Ecosystem Page
// Source: https://www.arc.io/ecosystem
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import React, { useState, useMemo } from 'react'

type Category =
  | 'All'
  | 'DeFi'
  | 'Infrastructure'
  | 'Banking'
  | 'Wallets'
  | 'Bridges'
  | 'Dev Tools'
  | 'Payments'
  | 'Custody'

interface Partner {
  name:     string
  url:      string
  logo?:    string
  category: Category[]
}

// ── Category visual config ────────────────────────────────────────────────────
const CAT_CONFIG: Record<Category, { badge: string; filter: string; glow: string; dot: string }> = {
  'All':            { badge: 'bg-white/10 text-white border-white/20',                             filter: 'bg-white/10 text-white',                             glow: '',                              dot: '#ffffff' },
  'DeFi':           { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',                    filter: 'bg-blue-600 text-white',                             glow: 'shadow-blue-900/40',            dot: '#3b82f6' },
  'Infrastructure': { badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',              filter: 'bg-purple-600 text-white',                           glow: 'shadow-purple-900/40',          dot: '#8b5cf6' },
  'Banking':        { badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',           filter: 'bg-emerald-600 text-white',                          glow: 'shadow-emerald-900/40',         dot: '#22c55e' },
  'Wallets':        { badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',              filter: 'bg-orange-500 text-white',                           glow: 'shadow-orange-900/40',          dot: '#f97316' },
  'Bridges':        { badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30',                    filter: 'bg-pink-600 text-white',                             glow: 'shadow-pink-900/40',            dot: '#ec4899' },
  'Dev Tools':      { badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',              filter: 'bg-yellow-500 text-black',                           glow: 'shadow-yellow-900/40',          dot: '#eab308' },
  'Payments':       { badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',                    filter: 'bg-cyan-600 text-white',                             glow: 'shadow-cyan-900/40',            dot: '#06b6d4' },
  'Custody':        { badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',                    filter: 'bg-rose-600 text-white',                             glow: 'shadow-rose-900/40',            dot: '#f43f5e' },
}

const CATEGORIES: Category[] = [
  'All', 'DeFi', 'Infrastructure', 'Banking', 'Wallets', 'Bridges', 'Dev Tools', 'Payments', 'Custody',
]

// ── Full partner list (source: arc.io/ecosystem) ──────────────────────────────
const PARTNERS: Partner[] = [
  { name: 'Aave',              url: 'https://aave.com/',                         logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900dc93490611b54729de1b_Logomark-dark.svg',                           category: ['DeFi'] },
  { name: 'Absa',              url: 'https://www.absa.co.za/personal/',           logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/693187304c807d0ace36d656_Absa%20logo%20badge_RGB_Passion_PNG.png',     category: ['Banking'] },
  { name: 'Across',            url: 'https://across.to/',                                                                                                                                                                     category: ['Bridges'] },
  { name: 'Alchemy',           url: 'https://www.alchemy.com/',                                                                                                                                                               category: ['Dev Tools', 'Infrastructure'] },
  { name: 'AllUnity',          url: 'https://allunity.com/',                      logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/695fe1b471d894335b2b9fa5_AU-logo-p-800.jpg',                           category: ['Payments'] },
  { name: 'Auros',             url: 'https://www.auros.global/',                                                                                                                                                               category: ['DeFi'] },
  { name: 'Avenia',            url: 'https://avenia.io/',                                                                                                                                                                      category: ['Infrastructure'] },
  { name: 'AWS',               url: 'https://aws.amazon.com/',                                                                                                                                                                 category: ['Infrastructure'] },
  { name: 'Axelar',            url: 'https://www.axelar.network/',                logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/693194bf9a1af940e00adf58_Logomark%20black.png',                        category: ['Bridges', 'Infrastructure'] },
  { name: 'B2C2',              url: 'https://www.b2c2.com/',                                                                                                                                                                   category: ['DeFi'] },
  { name: 'Bank Frick',        url: 'https://www.bankfrick.li/en',                                                                                                                                                            category: ['Banking'] },
  { name: 'BDACS (KRW1)',      url: 'https://krw1.kr/',                           logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/693187c663bdbaf3ca02e2c8_%5BBDACS%5DLOGO_Horizon-p-800.png',           category: ['Banking', 'Custody'] },
  { name: 'BitGo',             url: 'https://www.bitgo.com/',                     logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fff9093fe36d2f5f6dfa1d_BitGo_Logo-p-800.png',                        category: ['Custody'] },
  { name: 'Bitso / Juno',      url: 'https://buildwithjuno.com/en-US',                                                                                                                                                        category: ['Payments'] },
  { name: 'Bitvavo',           url: 'https://bitvavo.com/en',                                                                                                                                                                  category: ['Payments'] },
  { name: 'BlackRock',         url: 'https://www.blackrock.com/us/individual',    logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fffa71ebcaee49faa00df3_blackrock-logo-1.svg',                        category: ['Banking'] },
  { name: 'Blockdaemon',       url: 'https://www.blockdaemon.com/',                                                                                                                                                            category: ['Infrastructure'] },
  { name: 'Blockradar',        url: 'https://blockradar.co/',                     logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/695d54d23699edb39fe9a5ec_blockradar-icon.svg',                         category: ['Dev Tools'] },
  { name: 'Blockscout',        url: 'https://www.blockscout.com/',                                                                                                                                                             category: ['Dev Tools', 'Infrastructure'] },
  { name: 'BNY',               url: 'https://www.bny.com/corporate/global/en.html',                                                                                                                                           category: ['Banking', 'Custody'] },
  { name: 'Brex',              url: 'https://www.brex.com/',                                                                                                                                                                   category: ['Payments'] },
  { name: 'Bridge',            url: 'https://www.bridge.xyz/',                    logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd16415277266bdbbdbb9c_bridge-icon.svg',                             category: ['Bridges', 'Payments'] },
  { name: 'Bron',              url: 'https://bron.org/',                                                                                                                                                                       category: ['DeFi'] },
  { name: 'BTG Pactual',       url: 'https://www.btgpactual.us/',                                                                                                                                                              category: ['Banking'] },
  { name: 'Bybit',             url: 'https://www.bybit.com/en',                                                                                                                                                                category: ['Payments'] },
  { name: 'Careem',            url: 'https://www.careem.com/',                                                                                                                                                                 category: ['Payments'] },
  { name: 'Catena Labs',       url: 'https://catenalabs.com/',                                                                                                                                                                 category: ['Infrastructure'] },
  { name: 'Centrifuge',        url: 'https://centrifuge.io/',                                                                                                                                                                  category: ['DeFi'] },
  { name: 'CFi',               url: 'https://www.cfi.ag/',                        logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/693193dd014ebfc70bcb8516_image_720.png',                               category: ['Banking'] },
  { name: 'Chainalysis',       url: 'https://www.chainalysis.com/',                                                                                                                                                            category: ['Infrastructure'] },
  { name: 'Chainlink',         url: 'https://chain.link/',                        logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fffb074f79406a3b36d2ca_Chainlink_Logo_Blue.svg-p-800.png',           category: ['Infrastructure'] },
  { name: 'Chronicle Labs',    url: 'https://chroniclelabs.org/',                                                                                                                                                              category: ['Infrastructure'] },
  { name: 'Cloudflare',        url: 'https://www.cloudflare.com/',                                                                                                                                                             category: ['Infrastructure'] },
  { name: 'Coinbase',          url: 'https://www.coinbase.com/',                  logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fff8662cabb6a83be7fbce_Coinbase.svg%20(1)-p-800.png',                category: ['Wallets', 'Payments'] },
  { name: 'Coincheck',         url: 'https://coincheck.com/',                                                                                                                                                                  category: ['Payments'] },
  { name: 'Commerzbank',       url: 'https://www.commerzbank.de/group/',           logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6931882e2b90a9f4d3623462_CB-2022-Logo_centered_RGB_positive-p-800.png', category: ['Banking'] },
  { name: 'Copper',            url: 'https://copper.co/en',                                                                                                                                                                    category: ['Custody'] },
  { name: 'Copperx',           url: 'http://copperx.io/',                         logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/69319187a6d5259dd7998dee_Copperx.svg',                                 category: ['Payments'] },
  { name: 'Corpay',            url: 'https://www.corpay.com/',                                                                                                                                                                 category: ['Payments'] },
  { name: 'Crossmint',         url: 'https://www.crossmint.com/',                                                                                                                                                              category: ['Dev Tools'] },
  { name: 'Cumberland',        url: 'https://www.cumberland.io/',                 logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fffe526176dc96ae525651_cumberland-1.webp',                           category: ['DeFi'] },
  { name: 'Curve',             url: 'https://www.curve.finance/',                                                                                                                                                              category: ['DeFi'] },
  { name: 'Deutsche Bank',     url: 'https://www.db.com/',                        logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fffabb25afb016ba2323ff_DB-p-800.png',                                category: ['Banking'] },
  { name: 'dLocal',            url: 'https://www.dlocal.com/',                                                                                                                                                                 category: ['Payments'] },
  { name: 'Dromos Labs',       url: 'https://dromos.xyz/',                        logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd14e924a1c7acfeb176e1_Dromos%20Logo%20Symbol.svg',                  category: ['DeFi'] },
  { name: 'dRPC',              url: 'https://drpc.org/',                          logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/693189f3f45a0c21e76aa407_dRPC_fullcollor_black-2-png.webp',            category: ['Infrastructure'] },
  { name: 'Dynamic',           url: 'https://www.dynamic.xyz/',                                                                                                                                                                category: ['Dev Tools', 'Wallets'] },
  { name: 'EBANX',             url: 'https://www.ebanx.com/',                                                                                                                                                                  category: ['Payments'] },
  { name: 'Elliptic',          url: 'https://www.elliptic.co/',                                                                                                                                                                category: ['Infrastructure'] },
  { name: 'Emirates NBD',      url: 'https://www.emiratesnbd.com/en',                                                                                                                                                          category: ['Banking'] },
  { name: 'Exodus',            url: 'https://www.exodus.com/',                    logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe0b98635f0b30354af30_Exodus_symbol.svg',                           category: ['Wallets'] },
  { name: 'Fireblocks',        url: 'https://fireblocks.com/',                    logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900daae9b765d70fc08501f_Logotype-Network_Navy.svg',                   category: ['Custody', 'Infrastructure'] },
  { name: 'First Abu Dhabi Bank', url: 'https://www.bankfab.com/en-ae/personal',  logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900db57ec04602aca880848_FAB-logo-400x400.png',                        category: ['Banking'] },
  { name: 'FIS',               url: 'https://www.fisglobal.com/',                 logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe1da225b50a37335654e_FIS_Logo_Green.svg',                          category: ['Payments', 'Infrastructure'] },
  { name: 'Fluid',             url: 'https://fluid.io/',                          logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900e10b5adc0e69ee07601a_fluid-icon.svg',                              category: ['DeFi'] },
  { name: 'Forte AUD',         url: 'https://www.forteaud.com/',                  logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe23ec7329ee0ab66b5ba_Forte.svg',                                   category: ['Payments'] },
  { name: 'Forte Securities',  url: 'https://fortesecurities.com/',               logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe41a4b9d288ed469bedf_forte-securities-icon.svg',                   category: ['Banking'] },
  { name: 'Fun.xyz',           url: 'http://fun.xyz/',                            logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd146c435fbeb9f716d377_funxyz-icon.svg',                             category: ['Dev Tools'] },
  { name: 'Galaxy',            url: 'https://www.galaxy.com/',                    logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900dbae9f4652baeabfe978_Galaxy_Lockup_Horizontal_Black-p-800.png',    category: ['DeFi'] },
  { name: 'Goldman Sachs',     url: 'https://www.goldmansachs.com/',              logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fffba17b536e6f963ffee6_golden-sachs.svg',                            category: ['Banking'] },
  { name: 'Hashkey',           url: 'https://www.hashkey.com/en-US/',             logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6931898b18d709a190ef7167_20251024-125744-p-800.png',                   category: ['Custody', 'Payments'] },
  { name: 'Hecto Financial',   url: 'https://www.hectogroup.com/',                logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/69318aae2fa5b7288d558547_Hecto%20Financial_o_h.png',                   category: ['Payments'] },
  { name: 'Hecto Innovation',  url: 'https://www.hectogroup.com/',                logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6936df39a272acd7cec42b42_Hecto%20Innovation_o_h.png',                  category: ['Payments'] },
  { name: 'Hibachi',           url: 'https://hibachi.xyz/',                                                                                                                                                                    category: ['DeFi'] },
  { name: 'HSBC',              url: 'https://www.us.hsbc.com/',                   logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900dbe1cf51f7baaf2b8533_HSBC-p-800.png',                              category: ['Banking'] },
  { name: 'Hurupay',           url: 'https://www.hurupay.com/',                   logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6931927b18d709a190f2f493_hurupay-final-logo.jpg',                      category: ['Payments'] },
  { name: 'JPYC',              url: 'https://corporate.jpyc.co.jp/en',            logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/69318bb4566033cae926a16d_jpyc_logo_text_color-p-800.png',             category: ['Payments'] },
  { name: 'Keyrock',           url: 'https://keyrock.com/',                       logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900e1519f258f328ca00578_Keyrock_Logo_01_RGB_Black.svg',               category: ['DeFi'] },
  { name: 'Kraken',            url: 'https://www.kraken.com/',                    logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe502f5456af65703e98f_kraken-icon.svg',                             category: ['Payments'] },
  { name: 'Kyobo Life',        url: 'https://www.kyobo.com/',                     logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/69318c12a26808313c0bb4e0_KyoboLife_ci_horizontal_en.png',             category: ['Banking'] },
  { name: 'LayerZero',         url: 'http://layerzero.network/',                  logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900dfef2b1a23501670b341_LayerZero_emblem.svg',                        category: ['Bridges', 'Infrastructure'] },
  { name: 'Ledger',            url: 'https://www.ledger.com/',                    logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe5e84ec2263793433914_ledger-icon.svg',                             category: ['Wallets', 'Custody'] },
  { name: 'LianLian',          url: 'https://lianlianglobal.com/en',                                                                                                                                                           category: ['Payments'] },
  { name: 'Maple',             url: 'https://maple.finance/',                     logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900d56d012d389e7faa891a_%24SYRUP.svg',                                category: ['DeFi'] },
  { name: 'Mastercard',        url: 'https://www.mastercard.com/us/en.html',      logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe6774896869e72c76905_ma_symbol.svg',                               category: ['Payments'] },
  { name: 'MetaMask',          url: 'https://metamask.io/',                       logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe69c3c2919551840f621_MetaMask-icon-fox-with-margins.svg',          category: ['Wallets'] },
  { name: 'Morpho',            url: 'https://morpho.org/',                        logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900dd4d5ab8afd5b17ea7e3_Morpho-with-background-logo.svg',            category: ['DeFi'] },
  { name: 'Noah',              url: 'https://noah.io/',                           logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe7587a22c257245454af_noah-icon.svg',                               category: ['Payments'] },
  { name: 'Nuvei',             url: 'https://www.nuvei.com/',                     logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe79f5ade899ed1e1c1ec_Nuvei_Square-white.svg',                      category: ['Payments'] },
  { name: 'Pairpoint',         url: 'https://pairpoint.io/',                      logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe816c0d1d51101c02ba1_pairpoint-icon.svg',                         category: ['Infrastructure'] },
  { name: 'Paysafe',           url: 'https://www.paysafe.com/',                   logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe8b3689d1834834e5021_paysafe-icon-180x180.png',                    category: ['Payments'] },
  { name: 'PhotonPay',         url: 'https://www.photonpay.com/',                 logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900e285fb1b40140db37dc9_photonpay-icon.svg',                          category: ['Payments'] },
  { name: 'Pimlico',           url: 'https://www.pimlico.io/',                    logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd13ab4bb4bb22a0b54c12_pimlico-icon.svg',                            category: ['Dev Tools', 'Infrastructure'] },
  { name: 'Privy',             url: 'https://www.privy.io/',                      logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd1312a4091121d979e970_privy-icon.png',                              category: ['Dev Tools', 'Wallets'] },
  { name: 'QuickNode',         url: 'https://www.quicknode.com/',                 logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd12d85ce3de4f3d2cdcb6_quicknode-icon.svg',                          category: ['Infrastructure'] },
  { name: 'Rainbow',           url: 'https://rainbow.me/en-us/',                  logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbe95edd9ebf17c66f3c31_rainbow-medium.png',                          category: ['Wallets'] },
  { name: 'Ramp',              url: 'https://www.ramp.com/',                      logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbea2329b035a8c156c938_Ramp-Symbol-RGB-Slate-0125.svg',              category: ['Payments'] },
  { name: 'Ramp Network',      url: 'https://rampnetwork.com/',                   logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbea83f9fa8fe4a0a81be6_RAMP_logo_Digital__icon.svg',                 category: ['Payments'] },
  { name: 'RedStone',          url: 'https://www.redstone.finance/',                                                                                                                                                           category: ['Infrastructure'] },
  { name: 'Robinhood',         url: 'https://robinhood.com/',                     logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900e318d7464a6b99501838_RH_symbol_black.svg',                         category: ['Payments'] },
  { name: 'Sasai Fintech',     url: 'https://sasaifintech.com/',                                                                                                                                                               category: ['Payments'] },
  { name: 'SBI Holdings',      url: 'https://www.sbigroup.co.jp/english/',        logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900e364e45b7924525fe88f_SBI_Holdings.png',                            category: ['Banking'] },
  { name: 'SCB',               url: 'https://www.sc.com/en/',                     logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900e44af6a120ce9658f854_scb.svg',                                     category: ['Banking'] },
  { name: 'Securitize',        url: 'https://securitize.io/',                     logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fffc4c93a4d68c843c8ce6_securitize.svg',                             category: ['DeFi', 'Infrastructure'] },
  { name: 'Sequence',          url: 'https://sequence.xyz/',                                                                                                                                                                   category: ['Dev Tools', 'Wallets'] },
  { name: 'Societe Generale',  url: 'https://www.societegenerale.com/en',         logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd127f7e98595191d65e71_societe-general-icon.svg',                    category: ['Banking'] },
  { name: 'Stablecorp',        url: 'https://www.stablecorp.ca/',                 logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbf49134b8eddc013bbc28_stablecorp.svg',                              category: ['Payments'] },
  { name: 'Stargate',          url: 'https://stargate.finance/',                  logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd11b9f7a9ab1b2e573e01_stargate-icon.svg',                           category: ['Bridges', 'DeFi'] },
  { name: 'State Street',      url: 'https://www.statestreet.com/us/en',          logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fffa1bf4abf93ab8263516_State-street-logo-final.svg-p-800.png',       category: ['Banking', 'Custody'] },
  { name: 'Sumitomo',          url: 'https://www.sumitomocorp.com/en/global',     logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/69318d69ba3424e4bd070680_SumitomoCorporation-logo.svg',                category: ['Banking'] },
  { name: 'Superface',         url: 'http://superface.ai/',                                                                                                                                                                    category: ['Infrastructure'] },
  { name: 'Superform',         url: 'https://www.superform.xyz/',                 logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900e049efbf01e880c4e2ab_Superform_Brandmark.svg',                     category: ['DeFi'] },
  { name: 'Taurus',            url: 'https://www.taurushq.com/',                  logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbf68e9cbf70c2e3e77e6b_Taurus_Wordmark_FullColourDark_RGB.svg',      category: ['Custody'] },
  { name: 'Tenderly',          url: 'https://tenderly.co/',                       logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd120f907452fc9f98409b_Tenderly%20Symbol.svg',                       category: ['Dev Tools'] },
  { name: 'thirdweb',          url: 'https://thirdweb.com/',                      logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fbf6f8342b123c44122c39_thirdweb-icon.svg',                           category: ['Dev Tools'] },
  { name: 'Transak',           url: 'https://transak.com/',                       logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd0108ee31fc7f0e42d662_transak-icon.svg',                            category: ['Payments'] },
  { name: 'TRM',               url: 'https://www.trmlabs.com/',                   logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd0f25053bcfddb65184f2_trm-icon.svg',                                category: ['Infrastructure'] },
  { name: 'Turnkey',           url: 'https://turnkey.com/',                       logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd0f62e32065ffea007630_turnkey-icon-p-800.png',                      category: ['Dev Tools', 'Wallets'] },
  { name: 'Visa',              url: 'https://usa.visa.com/',                      logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd0f8d58458969f956af75_visa-brandmark-blue-1960x622-p-800.png',      category: ['Payments'] },
  { name: 'Vultisig',          url: 'https://vultisig.com/',                      logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6900e1e5e7ec4f7eb3069832_vultisig-icon.svg',                           category: ['Wallets'] },
  { name: 'WheelX',            url: 'https://wheelx.fi/',                                                                                                                                                                      category: ['DeFi'] },
  { name: 'WisdomTree',        url: 'https://www.wisdomtreeconnect.com/',         logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd0fe47bdd06f933b42010_wisdomtree-p-800.png',                         category: ['Banking', 'DeFi'] },
  { name: 'WorldPay',          url: 'https://www.worldpay.com/en',                logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/6931858de4041edf29ce8dcf_Worldpay_logo_b_rgb-p-800.png',               category: ['Payments'] },
  { name: 'Wormhole',          url: 'https://wormhole.com/',                      logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd102391e05fe3438b1781_Logomark%20black.svg',                         category: ['Bridges', 'Infrastructure'] },
  { name: 'Yellow Card',       url: 'https://yellowcard.io/',                     logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd107e52be5d2a8d27cdae_yellowcard-icon.svg',                          category: ['Payments'] },
  { name: 'ZeroDev',           url: 'https://zerodev.app/',                       logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd10e7f0bb57d288ddfef7_zerodev-icon.svg',                            category: ['Dev Tools'] },
  { name: 'zkp2p',             url: 'http://zkp2p.xyz/',                          logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/69318df44c807d0ace38f366_zkp2p.png',                                   category: ['DeFi'] },
  { name: 'Zodia Custody',     url: 'https://zodia-custody.com/',                 logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/68fd112ffd4917e1b6750918_zodia-icon.svg',                              category: ['Custody'] },
  { name: 'Zodia Markets',     url: 'https://zodiamarkets.com/',                  logo: 'https://cdn.prod.website-files.com/68af181813eec5493447a1ae/693186bcdb800c3839107744_ZM_Logo_Horizontal_RGB_Master.svg',           category: ['Banking', 'DeFi'] },
]

// ── Partner Card ──────────────────────────────────────────────────────────────

function PartnerCard({ partner }: { partner: Partner }) {
  // Pick the primary category color for the card left-border accent
  const primary   = partner.category[0]
  const dotColor  = CAT_CONFIG[primary].dot

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-center gap-3 rounded-2xl p-5
                 border border-white/8 hover:border-white/20
                 transition-all duration-200 text-center overflow-hidden"
      style={{ background: '#0f1117' }}
    >
      {/* Colored top-bar accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60
                   group-hover:opacity-100 transition-opacity"
        style={{ background: dotColor }}
      />

      {/* Logo container — white bg so dark logos are always visible */}
      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center
                      overflow-hidden shrink-0 shadow-md">
        {partner.logo ? (
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-10 h-10 object-contain"
            onError={e => {
              const el = e.target as HTMLImageElement
              el.style.display = 'none'
              el.parentElement!.innerHTML =
                `<span style="color:#000;font-weight:700;font-size:14px">${partner.name.slice(0,2).toUpperCase()}</span>`
            }}
          />
        ) : (
          <span className="text-black font-bold text-sm">
            {partner.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-white leading-tight
                    group-hover:text-blue-300 transition-colors">
        {partner.name}
      </p>

      {/* Category badges */}
      <div className="flex flex-wrap gap-1 justify-center">
        {partner.category.map(cat => (
          <span
            key={cat}
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${CAT_CONFIG[cat].badge}`}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                   transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${dotColor}14 0%, transparent 70%)` }}
      />
    </a>
  )
}

// ── Stats banner ──────────────────────────────────────────────────────────────

const STATS = [
  { value: `${PARTNERS.length}+`, label: 'Partners',        color: 'text-blue-400'   },
  { value: '8',                   label: 'Categories',      color: 'text-purple-400' },
  { value: '$1',                  label: 'USDC Gas Token',  color: 'text-emerald-400'},
  { value: '<1s',                 label: 'Finality',        color: 'text-cyan-400'   },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EcosystemPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() =>
    PARTNERS.filter(p => {
      const matchCat    = activeCategory === 'All' || p.category.includes(activeCategory)
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    }),
    [activeCategory, search]
  )

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-12">

      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30
                        bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Arc Network Ecosystem — arc.io/ecosystem
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Explore the{' '}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400
                           bg-clip-text text-transparent">
            Arc Ecosystem
          </span>
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-base">
          Businesses, infrastructure providers, and organisations building on Arc —
          the EVM-compatible L1 with <span className="text-emerald-400 font-medium">USDC as native gas</span>,
          instant finality, and no volatile token.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">

        {/* ── Search + filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search partners…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white
                         placeholder-zinc-500 outline-none transition-colors
                         bg-white/5 border border-white/10 focus:border-blue-500/50"
            />
          </div>

          {/* Category filter buttons */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const count  = cat === 'All' ? PARTNERS.length : PARTNERS.filter(p => p.category.includes(cat)).length
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                              border transition-all ${active
                    ? `${CAT_CONFIG[cat].filter} border-transparent shadow-lg ${CAT_CONFIG[cat].glow}`
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat !== 'All' && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: CAT_CONFIG[cat].dot }}
                    />
                  )}
                  {cat}
                  <span className={`text-xs ${active ? 'opacity-70' : 'text-zinc-600'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-zinc-600 mb-5">
          Showing <span className="text-zinc-400 font-medium">{filtered.length}</span> of {PARTNERS.length} partners
          {activeCategory !== 'All' && (
            <> in <span style={{ color: CAT_CONFIG[activeCategory].dot }} className="font-medium">{activeCategory}</span></>
          )}
          {search && <> matching "<span className="text-white">{search}</span>"</>}
        </p>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-400 text-lg mb-3">No partners found</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearch('') }}
              className="text-blue-400 hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map(p => <PartnerCard key={p.name} partner={p} />)}
          </div>
        )}

        {/* ── Footer CTA ── */}
        <div className="mt-20 rounded-3xl border border-white/10 overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #0f1117 0%, #0c1a3d 100%)' }}>
          <div className="p-10 text-center relative">
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37,99,235,0.2) 0%, transparent 70%)' }} />

            <h2 className="text-2xl font-extrabold text-white mb-2 relative">
              Build on <span className="text-blue-400">ARC DEX</span>
            </h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto relative">
              Arc is an EVM-compatible Layer-1 with USDC as native gas,
              sub-second finality, and {PARTNERS.length}+ ecosystem partners.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 relative">
              <a href="https://docs.arc.io" target="_blank" rel="noopener noreferrer"
                 className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500
                            text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-900/40">
                Read the Docs
              </a>
              <a href="https://faucet.circle.com" target="_blank" rel="noopener noreferrer"
                 className="px-5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30
                            border border-emerald-500/30 text-emerald-300 text-sm font-semibold transition-colors">
                Get Testnet USDC
              </a>
              <a href="https://testnet.arcscan.app" target="_blank" rel="noopener noreferrer"
                 className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15
                            text-white text-sm font-semibold transition-colors">
                ArcScan Explorer
              </a>
              <a href="https://discord.com/invite/buildonarc" target="_blank" rel="noopener noreferrer"
                 className="px-5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30
                            border border-purple-500/30 text-purple-300 text-sm font-semibold transition-colors">
                Join Discord
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
