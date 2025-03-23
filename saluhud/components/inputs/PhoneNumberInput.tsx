import React, { useState } from 'react';
import { Dimensions, FlatList, Image, ImageSourcePropType, LayoutChangeEvent, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from "react-i18next";
import "@root/i18n.config";
import FormTextInput, { FormTextInputValidationResult } from './FormTextInput';
import i18next from '@root/i18n.config';

interface PhoneNumberInputProps 
{
    labelIcon?: ImageSourcePropType;
    label: string;
    mainViewStyle: ViewStyle;
    labelViewStyle?: ViewStyle;
    labelTextStyle?: TextStyle;
    phoneInputViewStyle?: ViewStyle;
    phoneInputStyle?: TextStyle;
    placeholder?: string;
    dropdownStyle?: ViewStyle;
    value: string;
    setValue: (text: string) => void;
    validateFunction: (text: string) => FormTextInputValidationResult;
    countryPrefix: string;
    setCountryPrefix: (prefix: string) => void;
}

interface Size
{
    width: number;
    height: number;
}

export default function PhoneNumberInput({labelIcon, label, mainViewStyle, labelViewStyle, labelTextStyle, 
    phoneInputViewStyle, phoneInputStyle, placeholder, dropdownStyle, value, setValue, validateFunction, countryPrefix, setCountryPrefix} : Readonly<PhoneNumberInputProps>)
{
    const { t } = useTranslation();

    const internationalCountryCallingCodes = [
        {label: t("PHONE_NUMBER_DROPDOWN_CANADA_COUNTRY_CALLING_CODE_LABEL"), value: "+1", image: require("@resources/images/country_flags/canada.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_USA_COUNTRY_CALLING_CODE_LABEL"), value: "+1", image: require("@resources/images/country_flags/usa.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BERMUDA_COUNTRY_CALLING_CODE_LABEL"), value: "+1-441", image: require("@resources/images/country_flags/bermuda.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GREENLAND_COUNTRY_CALLING_CODE_LABEL"), value: "+299", image: require("@resources/images/country_flags/greenland.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SAINT_PIERRE_AND_MIQUELON_COUNTRY_CALLING_CODE_LABEL"), value: "+508", image: require("@resources/images/country_flags/france.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MEXICO_COUNTRY_CALLING_CODE_LABEL"), value: "+52", image: require("@resources/images/country_flags/mexico.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BAHAMAS_COUNTRY_CALLING_CODE_LABEL"), value: "+1-242", image: require("@resources/images/country_flags/bahamas.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BARBADOS_COUNTRY_CALLING_CODE_LABEL"), value: "+1-246", image: require("@resources/images/country_flags/barbados.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ANGUILA_COUNTRY_CALLING_CODE_LABEL"), value: "+1-264", image: require("@resources/images/country_flags/anguilla.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ANTIGUA_Y_BARBUDA_COUNTRY_CALLING_CODE_LABEL"), value: "+1-268", image: require("@resources/images/country_flags/antigua_and_barbuda.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BRITISH_VIRGIN_ISLANDS_COUNTRY_CALLING_CODE_LABEL"), value: "+1-284", image: require("@resources/images/country_flags/british_virgin_islands.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CAYMAN_ISLANDS_COUNTRY_CALLING_CODE_LABEL"), value: "+1-345", image: require("@resources/images/country_flags/cayman_islands.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GRENADA_COUNTRY_CALLING_CODE_LABEL"), value: "+1-473", image: require("@resources/images/country_flags/grenada.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_TURKS_AND_CAICOS_ISLANDS_COUNTRY_CALLING_CODE_LABEL"), value:"+1-649", image: require("@resources/images/country_flags/turks_and_caicos_islands.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MONTSERRAT_COUNTRY_CALLING_CODE_LABEL"), value: "+1-664", image: require("@resources/images/country_flags/montserrat.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SINT_MAARTEN_COUNTRY_CALLING_CODE_LABEL"), value: "+1-721", image: require("@resources/images/country_flags/sint_maarten.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SAINT_LUCIA_COUNTRY_CALLING_CODE_LABEL"), value: "+1-758", image: require("@resources/images/country_flags/saint_lucia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_DOMINICA_COUNTRY_CALLING_CODE_LABEL"), value: "+1-767", image: require("@resources/images/country_flags/dominica.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SAINT_VINCENT_AND_THE_GRENADINES_COUNTRY_CALLING_CODE_LABEL"), value: "+1-784", image: require("@resources/images/country_flags/saint_vincent_and_the_grenadines.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_DOMINICAN_REPUBLIC_1_COUNTRY_CALLING_CODE_LABEL"), value: "+1-809", image: require("@resources/images/country_flags/dominican_republic.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_DOMINICAN_REPUBLIC_2_COUNTRY_CALLING_CODE_LABEL"), value: "+1-829", image: require("@resources/images/country_flags/dominican_republic.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_DOMINICAN_REPUBLIC_3_COUNTRY_CALLING_CODE_LABEL"), value: "+1-849", image: require("@resources/images/country_flags/dominican_republic.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_TRINIDAD_AND_TOBAGO_COUNTRY_CALLING_CODE_LABEL"), value: "+1-868", image: require("@resources/images/country_flags/trinidad_and_tobago.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SAINT_KITTS_AND_NEVIS_COUNTRY_CALLING_CODE_LABEL"), value: "+1-869", image: require("@resources/images/country_flags/saint_kitts_and_nevis.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_JAMAICA_1_COUNTRY_CALLING_CODE_LABEL"), value: "+1-876", image: require("@resources/images/country_flags/jamaica.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_JAMAICA_2_COUNTRY_CALLING_CODE_LABEL"), value: "+1-658", image: require("@resources/images/country_flags/jamaica.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ARUBA_COUNTRY_CALLING_CODE_LABEL"), value: "+297", image: require("@resources/images/country_flags/aruba.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_HAITI_COUNTRY_CALLING_CODE_LABEL"), value: "+509", image: require("@resources/images/country_flags/haiti.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CUBA_COUNTRY_CALLING_CODE_LABEL"), value: "+53", image: require("@resources/images/country_flags/cuba.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GUADELOUPE_SAINT_BARTHELEMY_AND_SAINT_MARTIN_COUNTRY_CALLING_CODE_LABEL"), value: "+590", image: require("@resources/images/country_flags/france.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MARTINIQUE_COUNTRY_CALLING_CODE_LABEL"), value: "+596", image: require("@resources/images/country_flags/martinique.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CURAÇAO_COUNTRY_CALLING_CODE_LABEL"), value: "+599", image: require("@resources/images/country_flags/curaçao.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BONAIRE_COUNTRY_CALLING_CODE_LABEL"), value: "+599", image: require("@resources/images/country_flags/bonaire.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SAINT_EUSTATIUS_COUNTRY_CALLING_CODE_LABEL"), value: "+599", image: require("@resources/images/country_flags/sint_eustatius.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SABA_COUNTRY_CALLING_CODE_LABEL"), value: "+599", image: require("@resources/images/country_flags/saba.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BELIZE_COUNTRY_CALLING_CODE_LABEL"), value: "+501", image: require("@resources/images/country_flags/belize.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GUATEMALA_COUNTRY_CALLING_CODE_LABEL"), value: "+502", image: require("@resources/images/country_flags/guatemala.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_EL_SALVADOR_COUNTRY_CALLING_CODE_LABEL"), value: "+503", image: require("@resources/images/country_flags/el_salvador.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_HONDURAS_COUNTRY_CALLING_CODE_LABEL"), value: "+504", image: require("@resources/images/country_flags/honduras.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NICARAGUA_COUNTRY_CALLING_CODE_LABEL"), value: "+505", image: require("@resources/images/country_flags/nicaragua.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_COSTA_RICA_COUNTRY_CALLING_CODE_LABEL"), value: "+506", image: require("@resources/images/country_flags/costa_rica.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_PANAMA_COUNTRY_CALLING_CODE_LABEL"), value: "+507", image: require("@resources/images/country_flags/panama.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_FALKLAND_ISLANDS_COUNTRY_CALLING_CODE_LABEL"), value: "+500", image: require("@resources/images/country_flags/falkland_islands.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SOUTH_GEORGIA_AND_SOUTH_SANDWICH_ISLANDS_COUNTRY_CALLING_CODE_LABEL"), value: "+500", image: require("@resources/images/country_flags/south_georgia_and_the_south_sandwich_islands.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_PERU_COUNTRY_CALLING_CODE_LABEL"), value: "+51", image: require("@resources/images/country_flags/peru.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ARGENTINA_COUNTRY_CALLING_CODE_LABEL"), value: "+54", image: require("@resources/images/country_flags/argentina.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BRAZIL_COUNTRY_CALLING_CODE_LABEL"), value: "+55", image: require("@resources/images/country_flags/brazil.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CHILE_COUNTRY_CALLING_CODE_LABEL"), value: "+56", image: require("@resources/images/country_flags/chile.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_COLOMBIA_COUNTRY_CALLING_CODE_LABEL"), value: "+57", image: require("@resources/images/country_flags/colombia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_VENEZUELA_COUNTRY_CALLING_CODE_LABEL"), value: "+58", image: require("@resources/images/country_flags/venezuela.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BOLIVIA_COUNTRY_CALLING_CODE_LABEL"), value: "+591", image: require("@resources/images/country_flags/bolivia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GUYANA_COUNTRY_CALLING_CODE_LABEL"), value: "+592", image: require("@resources/images/country_flags/guyana.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ECUADOR_COUNTRY_CALLING_CODE_LABEL"), value: "+593", image: require("@resources/images/country_flags/ecuador.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_FRENCH_GUIANA_COUNTRY_CALLING_CODE_LABEL"), value: "+594", image: require("@resources/images/country_flags/french_guiana.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_PARAGUAY_COUNTRY_CALLING_CODE_LABEL"), value: "+595", image: require("@resources/images/country_flags/paraguay.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SURINAME_COUNTRY_CALLING_CODE_LABEL"), value: "+597", image: require("@resources/images/country_flags/suriname.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_URUGUAY_COUNTRY_CALLING_CODE_LABEL"), value: "+598", image: require("@resources/images/country_flags/uruguay.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_EGYPT_COUNTRY_CALLING_CODE_LABEL"), value: "+20", image: require("@resources/images/country_flags/egypt.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SOUTH_SUDAN_COUNTRY_CALLING_CODE_LABEL"), value: "+211", image: require("@resources/images/country_flags/south_sudan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MOROCCO_COUNTRY_CALLING_CODE_LABEL"), value: "+212", image: require("@resources/images/country_flags/morocco.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ALGERIA_COUNTRY_CALLING_CODE_LABEL"), value: "+213", image: require("@resources/images/country_flags/algeria.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SAHARAUI_REPUBLIC_COUNTRY_CALLING_CODE_LABEL"), value: "+214", image: require("@resources/images/country_flags/saharaui_republic.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_TUNISIA_COUNTRY_CALLING_CODE_LABEL"), value: "+216", image: require("@resources/images/country_flags/tunisia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_LIBYA_COUNTRY_CALLING_CODE_LABEL"), value: "+218", image: require("@resources/images/country_flags/libya.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GAMBIA_COUNTRY_CALLING_CODE_LABEL"), value: "+220", image: require("@resources/images/country_flags/gambia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SENEGAL_COUNTRY_CALLING_CODE_LABEL"), value: "+221", image: require("@resources/images/country_flags/senegal.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MAURITANIA_COUNTRY_CALLING_CODE_LABEL"), value: "+222", image: require("@resources/images/country_flags/mauritania.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MALI_COUNTRY_CALLING_CODE_LABEL"), value: "+223", image: require("@resources/images/country_flags/mali.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GUINEA_COUNTRY_CALLING_CODE_LABEL"), value: "+224", image: require("@resources/images/country_flags/guinea.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_IVORY_COAST_COUNTRY_CALLING_CODE_LABEL"), value: "+225", image: require("@resources/images/country_flags/ivory_coast.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BURKINA_FASO_COUNTRY_CALLING_CODE_LABEL"), value: "+226", image: require("@resources/images/country_flags/burkina_faso.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NIGER_COUNTRY_CALLING_CODE_LABEL"), value: "+227", image: require("@resources/images/country_flags/niger.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_TOGO_COUNTRY_CALLING_CODE_LABEL"), value: "+228", image: require("@resources/images/country_flags/togo.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BENIN_COUNTRY_CALLING_CODE_LABEL"), value: "+229", image: require("@resources/images/country_flags/benin.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MAURITIUS_COUNTRY_CALLING_CODE_LABEL"), value: "+230", image: require("@resources/images/country_flags/mauritius.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_LIBERIA_COUNTRY_CALLING_CODE_LABEL"), value: "+231", image: require("@resources/images/country_flags/liberia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SIERRA_LEONE_COUNTRY_CALLING_CODE_LABEL"), value: "+232", image: require("@resources/images/country_flags/sierra_leone.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GHANA_COUNTRY_CALLING_CODE_LABEL"), value: "+233", image: require("@resources/images/country_flags/ghana.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NIGERIA_COUNTRY_CALLING_CODE_LABEL"), value: "+234", image: require("@resources/images/country_flags/nigeria.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CHAD_COUNTRY_CALLING_CODE_LABEL"), value: "+235", image: require("@resources/images/country_flags/chad.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CENTRAL_AFRICAN_REPUBLIC_COUNTRY_CALLING_CODE_LABEL"), value: "+236", image: require("@resources/images/country_flags/central_african_republic.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CAMEROON_COUNTRY_CALLING_CODE_LABEL"), value: "+237", image: require("@resources/images/country_flags/cameroon.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CAPE_VERDE_COUNTRY_CALLING_CODE_LABEL"), value: "+238", image: require("@resources/images/country_flags/cape_verde.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SAO_TOME_AND_PRINCIPE_COUNTRY_CALLING_CODE_LABEL"), value: "+239", image: require("@resources/images/country_flags/sao_tome_and_principe.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_EQUATORIAL_GUINEA_COUNTRY_CALLING_CODE_LABEL"), value: "+240", image: require("@resources/images/country_flags/equatorial_guinea.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GABON_COUNTRY_CALLING_CODE_LABEL"), value: "+241", image: require("@resources/images/country_flags/gabon.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_REPUBLIC_OF_THE_CONGO_COUNTRY_CALLING_CODE_LABEL"), value: "+242", image: require("@resources/images/country_flags/republic_of_congo.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_DEMOCRATIC_REPUBLIC_OF_THE_CONGO_COUNTRY_CALLING_CODE_LABEL"), value: "+243", image: require("@resources/images/country_flags/democratic_republic_of_congo.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ANGOLA_COUNTRY_CALLING_CODE_LABEL"), value: "+244", image: require("@resources/images/country_flags/angola.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GUINEA_BISSAU_COUNTRY_CALLING_CODE_LABEL"), value: "+245", image: require("@resources/images/country_flags/guinea_bissau.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BRITISH_INDIAN_OCEAN_TERRITORY_COUNTRY_CALLING_CODE_LABEL"), value: "+246", image: require("@resources/images/country_flags/commissioner_of_british_indian_ocean_territory.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ASCENSION_ISLAND_COUNTRY_CALLING_CODE_LABEL"), value: "+247", image: require("@resources/images/country_flags/ascension_island.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SEYCHELLES_COUNTRY_CALLING_CODE_LABEL"), value: "+248", image: require("@resources/images/country_flags/seychelles.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SUDAN_COUNTRY_CALLING_CODE_LABEL"), value: "+249", image: require("@resources/images/country_flags/sudan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_RWANDA_COUNTRY_CALLING_CODE_LABEL"), value: "+250", image: require("@resources/images/country_flags/rwanda.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ETHIOPIA_COUNTRY_CALLING_CODE_LABEL"), value: "+251", image: require("@resources/images/country_flags/ethiopia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SOMALIA_COUNTRY_CALLING_CODE_LABEL"), value: "+252", image: require("@resources/images/country_flags/somalia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_DJIBOUTI_COUNTRY_CALLING_CODE_LABEL"), value: "+253", image: require("@resources/images/country_flags/djibouti.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_KENYA_COUNTRY_CALLING_CODE_LABEL"), value: "+254", image: require("@resources/images/country_flags/kenya.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_TANZANIA_COUNTRY_CALLING_CODE_LABEL"), value: "+255", image: require("@resources/images/country_flags/tanzania.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_UGANDA_COUNTRY_CALLING_CODE_LABEL"), value: "+256", image: require("@resources/images/country_flags/uganda.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BURUNDI_COUNTRY_CALLING_CODE_LABEL"), value: "+257", image: require("@resources/images/country_flags/burundi.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MOZAMBIQUE_COUNTRY_CALLING_CODE_LABEL"), value: "+258", image: require("@resources/images/country_flags/mozambique.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ZAMBIA_COUNTRY_CALLING_CODE_LABEL"), value: "+260", image: require("@resources/images/country_flags/zambia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MADAGASCAR_COUNTRY_CALLING_CODE_LABEL"), value: "+261", image: require("@resources/images/country_flags/madagascar.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_REUNION_COUNTRY_CALLING_CODE_LABEL"), value: "+262", image: require("@resources/images/country_flags/reunion.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MAYOTTE_COUNTRY_CALLING_CODE_LABEL"), value: "+262", image: require("@resources/images/country_flags/mayotte.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ZIMBABWE_COUNTRY_CALLING_CODE_LABEL"), value: "+263", image: require("@resources/images/country_flags/zimbabwe.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NAMIBIA_COUNTRY_CALLING_CODE_LABEL"), value: "+264", image: require("@resources/images/country_flags/namibia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MALAWI_COUNTRY_CALLING_CODE_LABEL"), value: "+265", image: require("@resources/images/country_flags/malawi.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_LESOTHO_COUNTRY_CALLING_CODE_LABEL"), value: "+266", image: require("@resources/images/country_flags/lesotho.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BOTSWANA_COUNTRY_CALLING_CODE_LABEL"), value: "+267", image: require("@resources/images/country_flags/botswana.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ESWATINI_COUNTRY_CALLING_CODE_LABEL"), value: "+268", image: require("@resources/images/country_flags/eswatini.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_COMOROS_COUNTRY_CALLING_CODE_LABEL"), value: "+269", image: require("@resources/images/country_flags/comoros.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SOUTH_AFRICA_COUNTRY_CALLING_CODE_LABEL"), value: "+27", image: require("@resources/images/country_flags/south_africa.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SAINT_HELENA_ASCENSION_AND_TRISTAN_DA_CUNHA_COUNTRY_CALLING_CODE_LABEL"), value:"+290", image: require("@resources/images/country_flags/saint_helena.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ERITREA_COUNTRY_CALLING_CODE_LABEL"), value: "+291", image: require("@resources/images/country_flags/eritrea.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_FAROE_ISLANDS_COUNTRY_CALLING_CODE_LABEL"), value: "+298", image: require("@resources/images/country_flags/faroe_islands.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GREECE_COUNTRY_CALLING_CODE_LABEL"), value: "+30", image: require("@resources/images/country_flags/greece.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NETHERLANDS_COUNTRY_CALLING_CODE_LABEL"), value: "+31", image: require("@resources/images/country_flags/netherlands.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BELGIUM_COUNTRY_CALLING_CODE_LABEL"), value: "+32", image: require("@resources/images/country_flags/belgium.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_FRANCE_COUNTRY_CALLING_CODE_LABEL"), value: "+33", image: require("@resources/images/country_flags/france.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SPAIN_COUNTRY_CALLING_CODE_LABEL"), value: "+34", image: require("@resources/images/country_flags/spain.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GIBRALTAR_COUNTRY_CALLING_CODE_LABEL"), value: "+350", image: require("@resources/images/country_flags/gibraltar.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_PORTUGAL_COUNTRY_CALLING_CODE_LABEL"), value: "+351", image: require("@resources/images/country_flags/portugal.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_LUXEMBOURG_COUNTRY_CALLING_CODE_LABEL"), value: "+352", image: require("@resources/images/country_flags/luxembourg.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_IRELAND_COUNTRY_CALLING_CODE_LABEL"), value: "+353", image: require("@resources/images/country_flags/ireland.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ICELAND_COUNTRY_CALLING_CODE_LABEL"), value: "+354", image: require("@resources/images/country_flags/iceland.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ALBANIA_COUNTRY_CALLING_CODE_LABEL"), value: "+355", image: require("@resources/images/country_flags/albania.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MALTA_COUNTRY_CALLING_CODE_LABEL"), value: "+356", image: require("@resources/images/country_flags/malta.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CYPRUS_COUNTRY_CALLING_CODE_LABEL"), value: "+357", image: require("@resources/images/country_flags/cyprus.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_FINLAND_COUNTRY_CALLING_CODE_LABEL"), value: "+358", image: require("@resources/images/country_flags/finland.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BULGARIA_COUNTRY_CALLING_CODE_LABEL"), value: "+359", image: require("@resources/images/country_flags/bulgaria.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_HUNGARY_COUNTRY_CALLING_CODE_LABEL"), value: "+36", image: require("@resources/images/country_flags/hungary.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_LITHUANIA_COUNTRY_CALLING_CODE_LABEL"), value: "+370", image: require("@resources/images/country_flags/lithuania.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_LATVIA_COUNTRY_CALLING_CODE_LABEL"), value: "+371", image: require("@resources/images/country_flags/latvia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ESTONIA_COUNTRY_CALLING_CODE_LABEL"), value: "+372", image: require("@resources/images/country_flags/estonia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MOLDOVA_COUNTRY_CALLING_CODE_LABEL"), value: "+373", image: require("@resources/images/country_flags/moldova.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ARMENIA_COUNTRY_CALLING_CODE_LABEL"), value: "+374", image: require("@resources/images/country_flags/armenia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BELARUS_COUNTRY_CALLING_CODE_LABEL"), value: "+375", image: require("@resources/images/country_flags/belarus.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ANDORRA_COUNTRY_CALLING_CODE_LABEL"), value: "+376", image: require("@resources/images/country_flags/andorra.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MONACO_COUNTRY_CALLING_CODE_LABEL"), value: "+377", image: require("@resources/images/country_flags/monaco.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SAN_MARINO_COUNTRY_CALLING_CODE_LABEL"), value: "+378", image: require("@resources/images/country_flags/san_marino.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_VATICAN_CITY_COUNTRY_CALLING_CODE_LABEL"), value: "+379", image: require("@resources/images/country_flags/vatican_city.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_UKRAINE_COUNTRY_CALLING_CODE_LABEL"), value: "+380", image: require("@resources/images/country_flags/ukraine.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SERBIA_COUNTRY_CALLING_CODE_LABEL"), value: "+381", image: require("@resources/images/country_flags/serbia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MONTENEGRO_COUNTRY_CALLING_CODE_LABEL"), value: "+382", image: require("@resources/images/country_flags/montenegro.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_KOSOVO_COUNTRY_CALLING_CODE_LABEL"), value: "+383", image: require("@resources/images/country_flags/kosovo.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CROATIA_COUNTRY_CALLING_CODE_LABEL"), value: "+385", image: require("@resources/images/country_flags/croatia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SLOVENIA_COUNTRY_CALLING_CODE_LABEL"), value: "+386", image: require("@resources/images/country_flags/slovenia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BOSNIA_AND_HERZEGOVINA_COUNTRY_CALLING_CODE_LABEL"), value: "+387", image: require("@resources/images/country_flags/bosnia_and_herzegovina.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NORTH_MACEDONIA_COUNTRY_CALLING_CODE_LABEL"), value: "+389", image: require("@resources/images/country_flags/north_macedonia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ITALY_COUNTRY_CALLING_CODE_LABEL"), value: "+39", image: require("@resources/images/country_flags/italy.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ROMANIA_COUNTRY_CALLING_CODE_LABEL"), value: "+40", image: require("@resources/images/country_flags/romania.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SWITZERLAND_COUNTRY_CALLING_CODE_LABEL"), value: "+41", image: require("@resources/images/country_flags/switzerland.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CZECH_REPUBLIC_COUNTRY_CALLING_CODE_LABEL"), value: "+420", image: require("@resources/images/country_flags/czech_republic.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SLOVAKIA_COUNTRY_CALLING_CODE_LABEL"), value: "+421", image: require("@resources/images/country_flags/slovakia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_LIECHTENSTEIN_COUNTRY_CALLING_CODE_LABEL"), value: "+423", image: require("@resources/images/country_flags/liechtenstein.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_AUSTRIA_COUNTRY_CALLING_CODE_LABEL"), value: "+43", image: require("@resources/images/country_flags/austria.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_UNITED_KINGDOM_COUNTRY_CALLING_CODE_LABEL"), value: "+44", image: require("@resources/images/country_flags/united_kingdom.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_DENMARK_COUNTRY_CALLING_CODE_LABEL"), value: "+45", image: require("@resources/images/country_flags/denmark.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SWEDEN_COUNTRY_CALLING_CODE_LABEL"), value: "+46", image: require("@resources/images/country_flags/sweden.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NORWAY_COUNTRY_CALLING_CODE_LABEL"), value: "+47", image: require("@resources/images/country_flags/norway.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_POLAND_COUNTRY_CALLING_CODE_LABEL"), value: "+48", image: require("@resources/images/country_flags/poland.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GERMANY_COUNTRY_CALLING_CODE_LABEL"), value: "+49", image: require("@resources/images/country_flags/germany.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_RUSSIA_COUNTRY_CALLING_CODE_LABEL"), value: "+7", image: require("@resources/images/country_flags/russia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_KAZAKHSTAN_COUNTRY_CALLING_CODE_LABEL"), value: "+7", image: require("@resources/images/country_flags/kazakhstan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ABKHAZIA_1_COUNTRY_CALLING_CODE_LABEL"), value: "+7-840", image: require("@resources/images/country_flags/republic_of_abkhazia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ABKHAZIA_2_COUNTRY_CALLING_CODE_LABEL"), value: "+7-940", image: require("@resources/images/country_flags/republic_of_abkhazia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SOUTH_OSSETIA_1_COUNTRY_CALLING_CODE_LABEL"), value: "+7-995", image: require("@resources/images/country_flags/south_ossetia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SOUTH_OSSETIA_2_COUNTRY_CALLING_CODE_LABEL"), value: "+7-997", image: require("@resources/images/country_flags/south_ossetia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_JAPAN_COUNTRY_CALLING_CODE_LABEL"), value: "+81", image: require("@resources/images/country_flags/japan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SOUTH_KOREA_COUNTRY_CALLING_CODE_LABEL"), value: "+82", image: require("@resources/images/country_flags/south_korea.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_VIETNAM_COUNTRY_CALLING_CODE_LABEL"), value: "+84", image: require("@resources/images/country_flags/vietnam.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NORTH_KOREA_COUNTRY_CALLING_CODE_LABEL"), value: "+850", image: require("@resources/images/country_flags/north_korea.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_HONG_KONG_COUNTRY_CALLING_CODE_LABEL"), value: "+852", image: require("@resources/images/country_flags/hong_kong.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MACAU_COUNTRY_CALLING_CODE_LABEL"), value: "+853", image: require("@resources/images/country_flags/macau.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CAMBODIA_COUNTRY_CALLING_CODE_LABEL"), value: "+855", image: require("@resources/images/country_flags/cambodia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_LAOS_COUNTRY_CALLING_CODE_LABEL"), value: "+856", image: require("@resources/images/country_flags/laos.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_CHINA_COUNTRY_CALLING_CODE_LABEL"), value: "+86", image: require("@resources/images/country_flags/china.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BANGLADESH_COUNTRY_CALLING_CODE_LABEL"), value: "+880", image: require("@resources/images/country_flags/bangladesh.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_TAIWAN_COUNTRY_CALLING_CODE_LABEL"), value: "+886", image: require("@resources/images/country_flags/taiwan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_TURKEY_COUNTRY_CALLING_CODE_LABEL"), value: "+90", image: require("@resources/images/country_flags/turkey.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NORTHERN_CYPRUS_COUNTRY_CALLING_CODE_LABEL"), value: "+90", image: require("@resources/images/country_flags/turkish_republic_of_northern_cyprus.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_INDIA_COUNTRY_CALLING_CODE_LABEL"), value: "+91", image: require("@resources/images/country_flags/india.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_PAKISTAN_COUNTRY_CALLING_CODE_LABEL"), value: "+92", image: require("@resources/images/country_flags/pakistan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_AFGANISTAN_COUNTRY_CALLING_CODE_LABEL"), value: "+93", image: require("@resources/images/country_flags/afghanistan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SRI_LANKA_COUNTRY_CALLING_CODE_LABEL"), value: "+94", image: require("@resources/images/country_flags/sri_lanka.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MYANMAR_COUNTRY_CALLING_CODE_LABEL"), value: "+95", image: require("@resources/images/country_flags/myanmar.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MALDIVES_COUNTRY_CALLING_CODE_LABEL"), value: "+960", image: require("@resources/images/country_flags/maldives.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_LEBANON_COUNTRY_CALLING_CODE_LABEL"), value: "+961", image: require("@resources/images/country_flags/lebanon.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_JORDAN_COUNTRY_CALLING_CODE_LABEL"), value: "+962", image: require("@resources/images/country_flags/jordan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SYRIA_COUNTRY_CALLING_CODE_LABEL"), value: "+963", image: require("@resources/images/country_flags/syria.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_IRAQ_COUNTRY_CALLING_CODE_LABEL"), value: "+964", image: require("@resources/images/country_flags/iraq.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_KUWAIT_COUNTRY_CALLING_CODE_LABEL"), value: "+965", image: require("@resources/images/country_flags/kuwait.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SAUDI_ARABIA_COUNTRY_CALLING_CODE_LABEL"), value: "+966", image: require("@resources/images/country_flags/saudi_arabia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_YEMEN_COUNTRY_CALLING_CODE_LABEL"), value: "+967", image: require("@resources/images/country_flags/yemen.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_OMAN_COUNTRY_CALLING_CODE_LABEL"), value: "+968", image: require("@resources/images/country_flags/oman.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_PALESTINE_COUNTRY_CALLING_CODE_LABEL"), value: "+970", image: require("@resources/images/country_flags/palestine.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_UNITED_ARAB_EMIRATES_COUNTRY_CALLING_CODE_LABEL"), value: "+971", image: require("@resources/images/country_flags/united_arab_emirates.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_ISRAEL_COUNTRY_CALLING_CODE_LABEL"), value: "+972", image: require("@resources/images/country_flags/israel.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BAHRAIN_COUNTRY_CALLING_CODE_LABEL"), value: "+973", image: require("@resources/images/country_flags/bahrain.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_QATAR_COUNTRY_CALLING_CODE_LABEL"), value: "+974", image: require("@resources/images/country_flags/qatar.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BHUTAN_COUNTRY_CALLING_CODE_LABEL"), value: "+975", image: require("@resources/images/country_flags/bhutan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MONGOLIA_COUNTRY_CALLING_CODE_LABEL"), value: "+976", image: require("@resources/images/country_flags/mongolia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NEPAL_COUNTRY_CALLING_CODE_LABEL"), value: "+977", image: require("@resources/images/country_flags/nepal.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_IRAN_COUNTRY_CALLING_CODE_LABEL"), value: "+98", image: require("@resources/images/country_flags/iran.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_TAJIKISTAN_COUNTRY_CALLING_CODE_LABEL"), value: "+992", image: require("@resources/images/country_flags/tajikistan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_TURKMENISTAN_COUNTRY_CALLING_CODE_LABEL"), value: "+993", image: require("@resources/images/country_flags/turkmenistan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_AZERBAIJAN_COUNTRY_CALLING_CODE_LABEL"), value: "+994", image: require("@resources/images/country_flags/azerbaijan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_GEORGIA_COUNTRY_CALLING_CODE_LABEL"), value: "+995", image: require("@resources/images/country_flags/georgia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_KYRGYZSTAN_COUNTRY_CALLING_CODE_LABEL"), value: "+996", image: require("@resources/images/country_flags/kyrgyzstan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_UZBEKISTAN_COUNTRY_CALLING_CODE_LABEL"), value: "+998", image: require("@resources/images/country_flags/uzbekistan.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MALAYSIA_COUNTRY_CALLING_CODE_LABEL"), value: "+60", image: require("@resources/images/country_flags/malaysia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_AUSTRALIA_COUNTRY_CALLING_CODE_LABEL"), value: "+61", image: require("@resources/images/country_flags/australia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_INDONESIA_COUNTRY_CALLING_CODE_LABEL"), value: "+62", image: require("@resources/images/country_flags/indonesia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_PHILIPPINES_COUNTRY_CALLING_CODE_LABEL"), value: "+63", image: require("@resources/images/country_flags/philippines.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NEW_ZEALAND_COUNTRY_CALLING_CODE_LABEL"), value: "+64", image: require("@resources/images/country_flags/new_zealand.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_PITCAIRN_ISLANDS_COUNTRY_CALLING_CODE_LABEL"), value: "+64", image: require("@resources/images/country_flags/pitcairn_islands.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SINGAPORE_COUNTRY_CALLING_CODE_LABEL"), value: "+65", image: require("@resources/images/country_flags/singapore.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_THAILAND_COUNTRY_CALLING_CODE_LABEL"), value: "+66", image: require("@resources/images/country_flags/thailand.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_EAST_TIMOR_COUNTRY_CALLING_CODE_LABEL"), value: "+670", image: require("@resources/images/country_flags/east_timor.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NORFOLK_ISLAND_COUNTRY_CALLING_CODE_LABEL"), value: "+672", image: require("@resources/images/country_flags/norfolk_island.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_BRUNEI_COUNTRY_CALLING_CODE_LABEL"), value: "+673", image: require("@resources/images/country_flags/brunei.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NAURU_COUNTRY_CALLING_CODE_LABEL"), value: "+674", image: require("@resources/images/country_flags/nauru.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_PAPUA_NEW_GUINEA_COUNTRY_CALLING_CODE_LABEL"), value: "+675", image: require("@resources/images/country_flags/papua_new_guinea.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_TONGA_COUNTRY_CALLING_CODE_LABEL"), value: "+676", image: require("@resources/images/country_flags/tonga.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SOLOMON_ISLANDS_COUNTRY_CALLING_CODE_LABEL"), value: "+677", image: require("@resources/images/country_flags/solomon_islands.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_VANUATU_COUNTRY_CALLING_CODE_LABEL"), value: "+678", image: require("@resources/images/country_flags/vanuatu.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_FIJI_COUNTRY_CALLING_CODE_LABEL"), value: "+679", image: require("@resources/images/country_flags/fiji.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_PALAU_COUNTRY_CALLING_CODE_LABEL"), value: "+680", image: require("@resources/images/country_flags/palau.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_WALLIS_AND_FUTUNA_COUNTRY_CALLING_CODE_LABEL"), value: "+681", image: require("@resources/images/country_flags/wallis_and_futuna.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_COOK_ISLANDS_COUNTRY_CALLING_CODE_LABEL"), value: "+682", image: require("@resources/images/country_flags/cook_islands.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NIUE_COUNTRY_CALLING_CODE_LABEL"), value: "+683", image: require("@resources/images/country_flags/Niue.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_SAMOA_COUNTRY_CALLING_CODE_LABEL"), value: "+685", image: require("@resources/images/country_flags/samoa.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_KIRIBATI_COUNTRY_CALLING_CODE_LABEL"), value: "+686", image: require("@resources/images/country_flags/kiribati.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_NEW_CALEDONIA_COUNTRY_CALLING_CODE_LABEL"), value: "+687", image: require("@resources/images/country_flags/new_caledonia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_TUVALU_COUNTRY_CALLING_CODE_LABEL"), value: "+688", image: require("@resources/images/country_flags/tuvalu.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_FRENCH_POLYNESIA_COUNTRY_CALLING_CODE_LABEL"), value: "+689", image: require("@resources/images/country_flags/french_polynesia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_TOKELAU_COUNTRY_CALLING_CODE_LABEL"), value: "+690", image: require("@resources/images/country_flags/tokelau.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_FEDERATED_STATES_OF_MICRONESIA_COUNTRY_CALLING_CODE_LABEL"), value: "+691", image: require("@resources/images/country_flags/micronesia.png")},
        {label: t("PHONE_NUMBER_DROPDOWN_MARSHALL_ISLANDS_COUNTRY_CALLING_CODE_LABEL"), value: "+692", image: require("@resources/images/country_flags/marshall_islands.png")}
    ];

    const renderItem = (item: any) => {
        return (
            <View style={[phoneNumberInputDefaultStyles.renderItemMainView]}>
                <Image source={item.image} style={[phoneNumberInputDefaultStyles.renderItemImage]} resizeMode="contain"/>
                <Text style={[]}>{item.label}</Text>
            </View>
        );
    };

    //const [selectedCountryPrefix, setSelectedCountryPrefix] = useState("+34");

    function obtainSelectedCountryPrefixFlag(selectedCountryPrefix: string)
    {
        for (let i = 0; i < internationalCountryCallingCodes.length; i++) {
            if(internationalCountryCallingCodes[i].value === selectedCountryPrefix)
            {
                return internationalCountryCallingCodes[i].image;
            }
        }
    }

    const renderLeftIcon = () => {
        return (
            <Image source={obtainSelectedCountryPrefixFlag(countryPrefix)} style={{height: "100%", width: "30%", marginRight: 5}} resizeMode="contain"/>
        );
    }

    const [validityImageSource, setValidityImageSource] = useState(require("@resources/icons/form_input_error.png"));
    const [isVisibleValidityImage, setIsVisibleValidityImage] = useState(false);
    const [isVisibleErrorMessage, setIsVisibleErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageSize, setErrorMessageSize] = useState<Size>({width: 0, height: 0});

    function executeValidateFunction(text: string, validateFunction: (text: string) => FormTextInputValidationResult) 
    {
        setIsVisibleValidityImage(true);
        let dataValidation = validateFunction(text);

        if (dataValidation.validationResult === true) 
        {
            console.log("Correcto");
            setValidityImageSource(require("@resources/icons/form_input_accepted.png"));
            setIsVisibleErrorMessage(false);
            setErrorMessageSize({width: 0, height: 0});
        }
        else 
        {
            console.log("Incorrecto: " + dataValidation.errorMessage);
            setValidityImageSource(require("@resources/icons/form_input_error.png"));
            setIsVisibleErrorMessage(true);
            setErrorMessage(dataValidation.errorMessage);
        }
    }

    const [phoneNumberInputSize, setPhoneNumberInputSize] = useState<Size>({ width: 0, height: 0 });
    const phoneNumberInputDynamicSize = isVisibleErrorMessage? {width: phoneNumberInputSize.width, height: phoneNumberInputSize.height} : {};

    function errorMessageOnLayoutEventFunction(event: LayoutChangeEvent)
    {
        console.log("Entro");

        if(errorMessageSize.height === 0)
        {
            const { width, height } = event.nativeEvent.layout;

            console.log("Phone error Message Ancho: " + width + ", Phone error Message Alto: " + height);

            setErrorMessageSize({
                width: width,
                height: height
            });

            setPhoneNumberInputSize({
                width: phoneNumberInputSize.width,
                height: phoneNumberInputSize.height + height
            });
        }
    }

    function phoneNumberInputOnLayoutEventFunction(event: LayoutChangeEvent)
    {
        const {width, height} = event.nativeEvent.layout;

        console.log("Ancho: " + width + ", Alto: " + height);

        setPhoneNumberInputSize({
            width: width,
            height: height
        });
    }

    return (
        <View style={[phoneNumberInputDefaultStyles.mainView, mainViewStyle, phoneNumberInputDynamicSize]} onLayout={phoneNumberInputOnLayoutEventFunction}>
            <View style={[phoneNumberInputDefaultStyles.labelView, labelViewStyle]}>
                <Image style={[phoneNumberInputDefaultStyles.labelIcon]} source={labelIcon ?? require("@resources/icons/phone_icon.png")} resizeMode="contain" resizeMethod='resize'></Image>
                <Text style={[phoneNumberInputDefaultStyles.labelText, labelTextStyle]}>{label}</Text>
            </View>

            <View style={[phoneNumberInputDefaultStyles.phoneInputView, phoneInputViewStyle]}>
                <Dropdown data={internationalCountryCallingCodes} labelField={"value"} valueField={"value"} onChange={item => setCountryPrefix(item.value)}
                    style={[phoneNumberInputDefaultStyles.dropdown, dropdownStyle]}
                    mode="modal" value={countryPrefix} placeholder='+34' containerStyle={[phoneNumberInputDefaultStyles.dropdownContainer]} search
                    searchPlaceholder={t("PHONE_NUMBER_DROPDOWN_SEARCH_PLACEHOLDER")} renderItem={renderItem}
                    flatListProps={{ initialNumToRender: 10, maxToRenderPerBatch: 20, windowSize: 10 }} renderLeftIcon={renderLeftIcon}
                    selectedTextStyle={{textAlign: 'center'}}></Dropdown>
                <TextInput style={[phoneNumberInputDefaultStyles.phoneInput, phoneInputStyle]} placeholder={placeholder ?? ""} 
                value={value} onChangeText={(text) => {setValue(text); executeValidateFunction(text, validateFunction);}}></TextInput>
                <Image source={validityImageSource} style={[phoneNumberInputDefaultStyles.textInputValidityImageStyle, { display: isVisibleValidityImage ? 'flex' : 'none' }]} resizeMode="contain"></Image>
            </View>
            <View style={{ display: isVisibleErrorMessage ? 'flex' : 'none', /*backgroundColor: "black"*/ }} onLayout={errorMessageOnLayoutEventFunction}>
                <Text style={phoneNumberInputDefaultStyles.errorMessageStyle}>{errorMessage}</Text>
            </View>
        </View>
    );
}

const phoneNumberInputDefaultStyles = StyleSheet.create({
    mainView: {
        display: "flex"
    },
    labelView: {
        flex: 2,
        flexDirection: "row",
        //backgroundColor: "green"
    },
    labelIcon: {
        height: '100%',
        width: '10%',
        marginRight: "2%",
        //backgroundColor: "blue"
    },
    labelText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        //backgroundColor: 'red',
        textAlignVertical: 'center',
        color: '#a80a2e',
        width: "88%"
    },
    phoneInputView: {
        flex: 3,
        flexDirection: "row",
        //backgroundColor: "purple",
        borderBottomWidth: 3,
        borderBottomColor: '#a80a2e'
    },
    phoneInput: {
        height: "100%",
        width: "60%",
        fontSize: 16,
        fontFamily: 'Roboto',
    },
    dropdown: {
        height: "100%",
        width: "30%",
        /*borderBottomWidth: 2,
        borderBottomColor: 'black',
        borderTopWidth: 2,
        borderTopColor: 'black',
        borderLeftWidth: 2,
        borderLeftColor: 'black',
        borderRightWidth: 2,
        borderRightColor: 'black'*/
    },
    dropdownContainer: {
        //backgroundColor: "red",
        height: "80%",
        width: (Dimensions.get('window').width - 20)
    },
    renderItemMainView: {
        display: "flex",
        flexDirection: "row",
        //backgroundColor: "blue",
        marginBottom: 10
    },
    renderItemImage: {
        height: "100%",
        width: "10%",
        marginRight: 5
    },
    textInputValidityImageStyle: {
        //backgroundColor: 'black',
        width: '10%',
        height: '60%',
        alignSelf: 'center'
    },
    errorMessageStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        textAlignVertical: 'center',
        color: '#a80a2e'
    }
})