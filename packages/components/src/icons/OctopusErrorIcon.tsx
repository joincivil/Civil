import * as React from "react";

export const OctopusErrorIcon: React.SFC = props => {
  const width = "74";
  const height = "73";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g>
        <path d="M36.6071788,31.1685393 C28.5453734,31.1685393 26.4957867,37.147811 26.4135683,37.4026464 C26.2127625,37.9018048 26.3116918,38.469053 26.6702452,38.8744006 C27.0287986,39.2797481 27.5874732,39.4559263 28.1197545,39.3315036 C28.6520359,39.207081 29.0695902,38.802706 29.2031204,38.2823321 C29.2178022,38.2405795 30.6566238,34.0480345 36.6013061,34.0480345 C42.4652381,34.0480345 43.9422325,38.1196407 43.9994917,38.2823321 C44.1941275,38.8783044 44.759054,39.2827362 45.3972041,39.2829567 C45.5496697,39.2824376 45.7011641,39.2591341 45.8464688,39.2138488 C46.2174281,39.0972914 46.5259471,38.8409479 46.7041069,38.501251 C46.8822667,38.1615541 46.9154619,37.766352 46.7963847,37.4026464 C46.7185709,37.1420521 44.6704524,31.1685393 36.6071788,31.1685393 Z" />
        <path d="M31.2444444,25.4269663 C31.2444444,23.6149759 29.9560194,22.1460674 28.3666667,22.1460674 C26.7773139,22.1460674 25.4888889,23.6149759 25.4888889,25.4269663 C25.4888889,27.2389567 26.7773139,28.7078652 28.3666667,28.7078652 C29.9550629,28.705235 31.2421374,27.2378661 31.2444444,25.4269663 Z" />
        <ellipse cx="44.8111111" cy="25.4269663" rx="2.87777778" ry="3.28089888" />
        <path
          d="M73.1941581,46.7305242 C73.6415006,45.8824671 74.070023,44.5994339 73.6357098,43.2156849 C73.2013966,41.8319358 72.2256397,40.9561453 71.5162615,40.4715412 C71.4091309,39.7125227 71.1413044,38.6002687 70.4797007,37.6660921 C69.6110743,36.4429046 68.29221,35.8590443 67.6754852,35.6415563 C66.5173167,34.7584675 65.4300861,34.4665373 64.4774925,34.7993377 C61.9425512,35.6824265 62.1293059,38.5491809 62.2798678,40.85251 C62.4608316,43.6258468 62.4564885,45.359912 60.8640068,46.0021584 C60.232805,46.2561377 59.3902374,46.0357304 58.5476699,45.3964033 C57.1318089,44.3221002 56.7134205,42.2537749 57.576256,40.5795553 C59.9447106,36.0152269 62.8850108,30.3225884 62.8850108,24.8707923 C62.8850108,18.0950928 60.0836908,11.7704254 54.9978834,7.0630512 C44.8181279,-2.3543504 29.1846579,-2.3543504 19.0049023,7.0630512 C13.919095,11.7748043 11.1177749,18.0994717 11.1177749,24.8707923 C11.1177749,30.3255077 14.0580752,36.0152269 16.4207389,40.5853939 C17.2893653,42.2537749 16.8651861,44.3221002 15.4493251,45.4022419 C14.6082052,46.041569 13.7641899,46.2605166 13.1329881,46.007997 C12.0703685,45.5788597 11.4449575,45.0183537 11.7171271,40.8583486 C11.8618982,38.5550195 12.0544437,35.6882651 9.51950243,34.8051763 C8.56690885,34.4723759 7.47388734,34.7643061 6.3215097,35.6473949 C5.70478498,35.8648829 4.38447291,36.4487433 3.51729426,37.6719307 C2.85569051,38.6061073 2.58786405,39.715442 2.48073346,40.4773798 C1.77135526,40.9619839 0.792702893,41.8450727 0.361285132,43.2215235 C-0.0701326292,44.5979743 0.361285132,45.8883057 0.802836867,46.7363628 C0.281661048,47.5785814 -0.253991876,48.8878883 0.131099145,50.3562971 C0.479997401,51.694797 1.38481653,52.555991 2.1448646,53.0668688 C1.98345364,54.4846143 2.46541985,55.9000659 3.45649041,56.9188876 C4.275907,57.792625 5.4071807,58.3006693 6.59947014,58.33037 C6.95500819,59.4060167 7.79150739,60.2504964 8.85789869,60.6103447 C9.36136629,60.7935038 9.89199517,60.889252 10.427217,60.893517 C8.30197781,62.1429782 6.40113379,63.4026569 6.40113379,65.9935372 C6.40113379,67.7451183 7.30595291,69.2456395 8.94620903,70.2002512 C9.24910149,70.3751082 9.56406597,70.5277917 9.88866864,70.6571219 C10.7292229,72.1184613 12.2827475,73.012795 13.9581832,72.9998616 C15.2484557,73.007886 16.5037052,72.5769332 17.520999,71.7766741 C18.7492812,72.2909628 20.0962206,72.4467463 21.4081019,72.2262466 C22.868343,71.9912533 24.2075437,71.2672828 25.20979,70.1710581 C26.320184,70.5447288 28.0530936,70.7549185 30.0147415,69.6587207 C31.6738179,68.728923 32.4845358,67.5203321 32.8739699,66.6708153 C32.9116104,66.5890748 32.9449078,66.508794 32.9767574,66.4314325 C34.262376,66.4487806 35.520016,66.0525266 36.5670797,65.3002031 C36.7213993,65.1900695 36.8666427,65.0675469 37.0013929,64.9338307 C37.1361431,65.0675469 37.2813865,65.1900695 37.4357061,65.3002031 C38.4835133,66.0529155 39.7425098,66.4482543 41.0289238,66.4285132 C41.0607734,66.5058747 41.0940708,66.5861555 41.1317113,66.667896 C41.5211454,67.5174128 42.3318633,68.7260037 43.9909397,69.6558014 C45.9525876,70.7549185 47.6840495,70.5418095 48.7958912,70.1681388 C49.796857,71.2675949 51.136203,71.9947293 52.5975793,72.2320852 C53.9090626,72.4501841 55.2549384,72.2923844 56.4817868,71.7766741 C57.4998387,72.5748428 58.7550173,73.0037144 60.0446026,72.994023 C61.7175125,73.007409 63.2693395,72.1162016 64.1112217,70.6585815 C64.319692,70.5724621 64.5194761,70.4819638 64.7120216,70.3841672 C66.5752252,69.4353941 67.6074428,67.8735676 67.6074428,65.9891583 C67.6074428,63.3982779 65.7065988,62.1327606 63.5828073,60.889138 C64.1185132,60.8850098 64.6496406,60.78926 65.1535734,60.6059658 C66.2156735,60.2447007 67.0484195,59.402385 67.4033156,58.33037 C68.594934,58.2979858 69.7245601,57.787878 70.5419522,56.913049 C71.5330228,55.8942273 72.014989,54.4787757 71.853578,53.0610302 C72.6136261,52.5501524 73.5169975,51.6889584 73.8673435,50.3504585 C74.2553299,48.8820497 73.719677,47.5727428 73.1941581,46.7305242 Z M64.7018876,65.9979162 C64.7018876,66.5219309 64.5571166,67.2006685 63.3989481,67.7874482 C62.3377762,68.327519 60.7452946,68.6136106 58.7966761,68.6136106 C58.2697094,68.6136106 57.7268179,68.5917159 57.1723448,68.5508456 C57.0995822,68.5268568 57.0250269,68.5087965 56.9493973,68.4968386 C56.8150941,68.4756597 56.6783417,68.4756597 56.5440384,68.4968386 C54.2633408,68.2600266 52.0154729,67.7705217 49.8411383,67.0371876 C49.7448733,66.9924144 49.644506,66.9572161 49.5414622,66.9320928 L49.5211942,66.9320928 C47.1947233,66.1249058 44.9782783,65.0535221 43.1512675,63.7704889 C43.0953692,63.7121042 43.0348479,63.6584062 42.9703037,63.6099273 C42.8981177,63.557679 42.8210194,63.5127008 42.7401177,63.4756394 C40.1646406,61.5591178 38.4491035,59.2047009 38.4491035,56.5846275 C38.4491035,55.7784846 37.8009414,55.1249766 37.0013929,55.1249766 C36.2018444,55.1249766 35.5536823,55.7784846 35.5536823,56.5846275 C35.5536823,58.0559556 34.9413007,60.7533905 31.2206844,63.4960745 C31.1640625,63.524978 31.1094113,63.5576491 31.0570931,63.5938712 C30.9966583,63.6376326 30.9399963,63.6864611 30.887711,63.7398362 C30.4258913,64.0638788 29.922088,64.3893809 29.3661671,64.7119638 C27.8446115,65.5898568 26.2452127,66.3228523 24.5887221,66.9014401 C24.5474067,66.9056225 24.5063334,66.9119561 24.4656667,66.9204156 C24.3168539,66.9512512 24.1743705,67.0075299 24.044383,67.0868158 C21.9121016,67.7981015 19.7091286,68.2723825 17.4746722,68.5012175 C17.3308828,68.4771791 17.1841485,68.4771791 17.040359,68.5012175 C16.959958,68.5133863 16.8809252,68.5334297 16.8043822,68.5610632 C14.0537321,68.7566564 11.7200226,68.457428 10.3881288,67.6852726 C9.41671498,67.1189281 9.29076416,66.4912782 9.29076416,66.0066741 C9.29076416,65.024329 10.1130638,64.4536055 12.2889728,63.1880882 C15.159783,61.5182476 19.0932127,59.2309746 21.6324971,53.3544201 C21.9523165,52.615187 21.6172166,51.754517 20.8840307,51.4320598 C20.1508447,51.1096027 19.2972152,51.4474663 18.9773958,52.1866993 C17.9639984,54.5323583 16.6958039,56.2007393 15.3581193,57.4720953 C14.6911555,57.4347376 14.0275146,57.3513421 13.3718604,57.222495 C13.3106507,57.2054274 13.2482077,57.1932262 13.1851057,57.1860037 C12.3441091,57.0162291 11.5185046,56.7765134 10.7167591,56.4693151 C10.0949708,56.2257211 9.49284927,55.9338896 8.91580711,55.5964438 C8.87120152,55.5464946 8.82279753,55.5001316 8.77103605,55.457777 C8.64048192,55.3573653 8.4934886,55.2807923 8.33672287,55.2315311 C7.01215431,54.3714299 5.92496543,53.187401 5.17637061,51.7896743 C5.16623664,51.7604813 5.15610266,51.7298286 5.14307327,51.6991759 C5.10945196,51.6215766 5.0687405,51.5473007 5.02146558,51.477309 C4.33352148,50.0684834 3.99142674,48.513607 4.02399297,46.9436333 C4.02977763,46.8707672 4.02977763,46.7975517 4.02399297,46.7246856 C4.13112355,43.6827731 5.49197152,41.2130438 6.02617674,40.3562287 C7.17855438,38.5243668 8.2599942,37.766808 8.65956233,37.612085 C9.00556517,37.9536433 8.90133,39.5680172 8.82894447,40.6612958 C8.74063413,42.0158518 8.64074209,43.5528642 8.95344759,44.9482905 C9.3645974,46.7801524 10.4083967,48.0471294 12.0602345,48.7141898 C13.6527162,49.3549766 15.5217106,48.9973621 17.1909209,47.7303851 C19.7244145,45.8065652 20.497492,42.1559783 18.9889775,39.2381361 C16.7725326,34.9496818 14.0131962,29.6117384 14.0131962,24.8722519 C14.0131962,18.9241745 16.4815427,13.3614449 20.9622071,9.21019769 C30.0340585,0.81797143 43.9658318,0.81797143 53.0376833,9.21019769 C57.5255862,13.3614449 59.9866942,18.9241745 59.9866942,24.8722519 C59.9866942,29.6117384 57.2273578,34.9438432 55.0109128,39.2381361 C53.5023984,42.1574379 54.2754759,45.8065652 56.8089694,47.7303851 C58.4781797,48.9973621 60.3486219,49.3549766 61.9396558,48.7141898 C63.5900459,48.048589 64.635293,46.781612 65.0464428,44.9497501 C65.3591483,43.5543239 65.2592562,42.0173115 65.1709459,40.6627554 C65.0985604,39.5694769 64.9943252,37.955103 65.340328,37.6135447 C65.7398962,37.7595098 66.8271268,38.5258265 67.9708182,40.3576884 C68.5050234,41.2130438 69.8644237,43.6813135 69.973002,46.7203067 C69.9672,46.794634 69.9672,46.869306 69.973002,46.9436333 C70.0063391,48.5317657 69.6560595,50.1042428 68.952366,51.5254775 C68.9205164,51.5794845 68.8901144,51.6349513 68.8626079,51.6918777 L68.8336537,51.7663199 C68.0863624,53.1739497 66.9963482,54.3668816 65.6660629,55.2329908 C65.5091196,55.2811184 65.3620168,55.357254 65.2317497,55.457777 C65.1764872,55.499708 65.1246829,55.5460818 65.0768447,55.5964438 C64.4981881,55.9303683 63.8945948,56.2183052 63.2715496,56.4576379 C61.7833012,57.0255083 60.2185472,57.3635782 58.6301894,57.460418 C57.2939525,56.1890621 56.0243103,54.5206811 55.0109128,52.1750221 C54.6910934,51.4357891 53.8374639,51.0979255 53.104278,51.4203827 C52.3710921,51.7428399 52.0359923,52.6035098 52.3558116,53.3427428 C54.895096,59.2192974 58.8285257,61.5065704 61.6993358,63.176411 C63.8839312,64.4404687 64.7062308,65.0111922 64.7062308,65.9935372 L64.7018876,65.9979162 Z"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
};
