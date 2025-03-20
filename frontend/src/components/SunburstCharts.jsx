import { ResponsiveSunburst } from '@nivo/sunburst'

// const data ={
//     "name": "nivo",
//     "color": "hsl(110, 70%, 50%)",
//     "children": [
//       {
//         "name": "viz",
//         "color": "hsl(30, 70%, 50%)",
//         "children": [
//           {
//             "name": "stack",
//             "color": "hsl(349, 70%, 50%)",
//             "children": [
//               {
//                 "name": "cchart",
//                 "color": "hsl(158, 70%, 50%)",
//                 "loc": 78965
//               },
//               {
//                 "name": "xAxis",
//                 "color": "hsl(156, 70%, 50%)",
//                 "loc": 130352
//               },
//               {
//                 "name": "yAxis",
//                 "color": "hsl(325, 70%, 50%)",
//                 "loc": 38214
//               },
//               {
//                 "name": "layers",
//                 "color": "hsl(142, 70%, 50%)",
//                 "loc": 139714
//               }
//             ]
//           },
//           {
//             "name": "ppie",
//             "color": "hsl(202, 70%, 50%)",
//             "children": [
//               {
//                 "name": "chart",
//                 "color": "hsl(287, 70%, 50%)",
//                 "children": [
//                   {
//                     "name": "pie",
//                     "color": "hsl(192, 70%, 50%)",
//                     "children": [
//                       {
//                         "name": "outline",
//                         "color": "hsl(326, 70%, 50%)",
//                         "loc": 137022
//                       },
//                       {
//                         "name": "slices",
//                         "color": "hsl(356, 70%, 50%)",
//                         "loc": 112824
//                       },
//                       {
//                         "name": "bbox",
//                         "color": "hsl(4, 70%, 50%)",
//                         "loc": 105908
//                       }
//                     ]
//                   },
//                   {
//                     "name": "donut",
//                     "color": "hsl(42, 70%, 50%)",
//                     "loc": 112784
//                   },
//                   {
//                     "name": "gauge",
//                     "color": "hsl(349, 70%, 50%)",
//                     "loc": 108867
//                   }
//                 ]
//               },
//               {
//                 "name": "legends",
//                 "color": "hsl(200, 70%, 50%)",
//                 "loc": 174864
//               }
//             ]
//           }
//         ]
//       },
//       {
//         "name": "colors",
//         "color": "hsl(281, 70%, 50%)",
//         "children": [
//           {
//             "name": "rgb",
//             "color": "hsl(263, 70%, 50%)",
//             "loc": 44884
//           },
//           {
//             "name": "hsl",
//             "color": "hsl(260, 70%, 50%)",
//             "loc": 23847
//           }
//         ]
//       },
//       {
//         "name": "utils",
//         "color": "hsl(206, 70%, 50%)",
//         "children": [
//           {
//             "name": "randomize",
//             "color": "hsl(246, 70%, 50%)",
//             "loc": 38319
//           },
//           {
//             "name": "resetClock",
//             "color": "hsl(224, 70%, 50%)",
//             "loc": 11865
//           },
//           {
//             "name": "noop",
//             "color": "hsl(72, 70%, 50%)",
//             "loc": 77422
//           },
//           {
//             "name": "tick",
//             "color": "hsl(317, 70%, 50%)",
//             "loc": 133405
//           },
//           {
//             "name": "forceGC",
//             "color": "hsl(107, 70%, 50%)",
//             "loc": 136615
//           },
//           {
//             "name": "stackTrace",
//             "color": "hsl(224, 70%, 50%)",
//             "loc": 107561
//           },
//           {
//             "name": "dbg",
//             "color": "hsl(72, 70%, 50%)",
//             "loc": 61903
//           }
//         ]
//       },
//       {
//         "name": "generators",
//         "color": "hsl(9, 70%, 50%)",
//         "children": [
//           {
//             "name": "address",
//             "color": "hsl(346, 70%, 50%)",
//             "loc": 4968
//           },
//           {
//             "name": "city",
//             "color": "hsl(137, 70%, 50%)",
//             "loc": 96014
//           },
//           {
//             "name": "animal",
//             "color": "hsl(214, 70%, 50%)",
//             "loc": 83260
//           },
//           {
//             "name": "movie",
//             "color": "hsl(4, 70%, 50%)",
//             "loc": 104210
//           },
//           {
//             "name": "user",
//             "color": "hsl(190, 70%, 50%)",
//             "loc": 144073
//           }
//         ]
//       },
//       {
//         "name": "set",
//         "color": "hsl(146, 70%, 50%)",
//         "children": [
//           {
//             "name": "clone",
//             "color": "hsl(219, 70%, 50%)",
//             "loc": 106279
//           },
//           {
//             "name": "intersect",
//             "color": "hsl(69, 70%, 50%)",
//             "loc": 67432
//           },
//           {
//             "name": "merge",
//             "color": "hsl(67, 70%, 50%)",
//             "loc": 155840
//           },
//           {
//             "name": "reverse",
//             "color": "hsl(339, 70%, 50%)",
//             "loc": 104969
//           },
//           {
//             "name": "toArray",
//             "color": "hsl(100, 70%, 50%)",
//             "loc": 937
//           },
//           {
//             "name": "toObject",
//             "color": "hsl(9, 70%, 50%)",
//             "loc": 191993
//           },
//           {
//             "name": "fromCSV",
//             "color": "hsl(242, 70%, 50%)",
//             "loc": 136788
//           },
//           {
//             "name": "slice",
//             "color": "hsl(18, 70%, 50%)",
//             "loc": 6893
//           },
//           {
//             "name": "append",
//             "color": "hsl(356, 70%, 50%)",
//             "loc": 47009
//           },
//           {
//             "name": "prepend",
//             "color": "hsl(248, 70%, 50%)",
//             "loc": 109249
//           },
//           {
//             "name": "shuffle",
//             "color": "hsl(39, 70%, 50%)",
//             "loc": 132535
//           },
//           {
//             "name": "pick",
//             "color": "hsl(279, 70%, 50%)",
//             "loc": 78262
//           },
//           {
//             "name": "plouc",
//             "color": "hsl(33, 70%, 50%)",
//             "loc": 124885
//           }
//         ]
//       },
//       {
//         "name": "text",
//         "color": "hsl(124, 70%, 50%)",
//         "children": [
//           {
//             "name": "trim",
//             "color": "hsl(68, 70%, 50%)",
//             "loc": 114250
//           },
//           {
//             "name": "slugify",
//             "color": "hsl(26, 70%, 50%)",
//             "loc": 98906
//           },
//           {
//             "name": "snakeCase",
//             "color": "hsl(44, 70%, 50%)",
//             "loc": 44926
//           },
//           {
//             "name": "camelCase",
//             "color": "hsl(246, 70%, 50%)",
//             "loc": 118439
//           },
//           {
//             "name": "repeat",
//             "color": "hsl(45, 70%, 50%)",
//             "loc": 126616
//           },
//           {
//             "name": "padLeft",
//             "color": "hsl(123, 70%, 50%)",
//             "loc": 112632
//           },
//           {
//             "name": "padRight",
//             "color": "hsl(78, 70%, 50%)",
//             "loc": 143611
//           }
//         ]
//       }
//     ]
//   };
const data = {
    "name": "nivo",
    "color": "hsl(110, 70%, 50%)",
    "children": [
      {
        "name": "viz",
        "color": "hsl(30, 70%, 50%)",
        "children": [
          {
            "name": "stack",
            "color": "hsl(349, 70%, 50%)",
            "children": [
              {
                "name": "cchart",
                "color": "hsl(158, 70%, 50%)",
                "loc": 78965
              },
              {
                "name": "xAxis",
                "color": "hsl(156, 70%, 50%)",
                "loc": 130352
              },
              {
                "name": "yAxis",
                "color": "hsl(325, 70%, 50%)",
                "loc": 38214
              },
              {
                "name": "layers",
                "color": "hsl(142, 70%, 50%)",
                "loc": 139714
              }
            ]
          },
          {
            "name": "ppie",
            "color": "hsl(202, 70%, 50%)",
            "children": [
              {
                "name": "chart",
                "color": "hsl(287, 70%, 50%)",
                "children": [
                  {
                    "name": "pie",
                    "color": "hsl(192, 70%, 50%)",
                    "children": [
                      {
                        "name": "outline",
                        "color": "hsl(326, 70%, 50%)",
                        "loc": 137022
                      },
                      {
                        "name": "slices",
                        "color": "hsl(356, 70%, 50%)",
                        "loc": 112824
                      },
                      {
                        "name": "bbox",
                        "color": "hsl(4, 70%, 50%)",
                        "loc": 105908
                      }
                    ]
                  },
                  {
                    "name": "donut",
                    "color": "hsl(42, 70%, 50%)",
                    "loc": 112784
                  },
                  {
                    "name": "gauge",
                    "color": "hsl(349, 70%, 50%)",
                    "loc": 108867
                  }
                ]
              },
              {
                "name": "legends",
                "color": "hsl(200, 70%, 50%)",
                "loc": 174864
              }
            ]
          }
        ]
      },
      {
        "name": "colors",
        "color": "hsl(281, 70%, 50%)",
        "children": [
          {
            "name": "rgb",
            "color": "hsl(263, 70%, 50%)",
            "loc": 44884
          },
          {
            "name": "hsl",
            "color": "hsl(260, 70%, 50%)",
            "loc": 23847
          }
        ]
      },
      {
        "name": "utils",
        "color": "hsl(206, 70%, 50%)",
        "children": [
          {
            "name": "randomize",
            "color": "hsl(246, 70%, 50%)",
            "loc": 38319
          },
          {
            "name": "resetClock",
            "color": "hsl(224, 70%, 50%)",
            "loc": 11865
          },
          {
            "name": "noop",
            "color": "hsl(72, 70%, 50%)",
            "loc": 77422
          },
          {
            "name": "tick",
            "color": "hsl(317, 70%, 50%)",
            "loc": 133405
          },
          {
            "name": "forceGC",
            "color": "hsl(107, 70%, 50%)",
            "loc": 136615
          },
          {
            "name": "stackTrace",
            "color": "hsl(224, 70%, 50%)",
            "loc": 107561
          },
          {
            "name": "dbg",
            "color": "hsl(72, 70%, 50%)",
            "loc": 61903
          }
        ]
      },
      {
        "name": "generators",
        "color": "hsl(9, 70%, 50%)",
        "children": [
          {
            "name": "address",
            "color": "hsl(346, 70%, 50%)",
            "loc": 4968
          },
          {
            "name": "city",
            "color": "hsl(137, 70%, 50%)",
            "loc": 96014
          },
          {
            "name": "animal",
            "color": "hsl(214, 70%, 50%)",
            "loc": 83260
          },
          {
            "name": "movie",
            "color": "hsl(4, 70%, 50%)",
            "loc": 104210
          },
          {
            "name": "user",
            "color": "hsl(190, 70%, 50%)",
            "loc": 144073
          }
        ]
      },
      {
        "name": "set",
        "color": "hsl(146, 70%, 50%)",
        "children": [
          {
            "name": "clone",
            "color": "hsl(219, 70%, 50%)",
            "loc": 106279
          },
          {
            "name": "intersect",
            "color": "hsl(69, 70%, 50%)",
            "loc": 67432
          },
          {
            "name": "merge",
            "color": "hsl(67, 70%, 50%)",
            "loc": 155840
          },
          {
            "name": "reverse",
            "color": "hsl(339, 70%, 50%)",
            "loc": 104969
          },
          {
            "name": "toArray",
            "color": "hsl(100, 70%, 50%)",
            "loc": 937
          },
          {
            "name": "toObject",
            "color": "hsl(9, 70%, 50%)",
            "loc": 191993
          },
          {
            "name": "fromCSV",
            "color": "hsl(242, 70%, 50%)",
            "loc": 136788
          },
          {
            "name": "slice",
            "color": "hsl(18, 70%, 50%)",
            "loc": 6893
          },
          {
            "name": "append",
            "color": "hsl(356, 70%, 50%)",
            "loc": 47009
          },
          {
            "name": "prepend",
            "color": "hsl(248, 70%, 50%)",
            "loc": 109249
          },
          {
            "name": "shuffle",
            "color": "hsl(39, 70%, 50%)",
            "loc": 132535
          },
          {
            "name": "pick",
            "color": "hsl(279, 70%, 50%)",
            "loc": 78262
          },
          {
            "name": "plouc",
            "color": "hsl(33, 70%, 50%)",
            "loc": 124885
          }
        ]
      },
      {
        "name": "text",
        "color": "hsl(124, 70%, 50%)",
        "children": [
          {
            "name": "trim",
            "color": "hsl(68, 70%, 50%)",
            "loc": 114250
          },
          {
            "name": "slugify",
            "color": "hsl(26, 70%, 50%)",
            "loc": 98906
          },
          {
            "name": "snakeCase",
            "color": "hsl(44, 70%, 50%)",
            "loc": 44926
          },
          {
            "name": "camelCase",
            "color": "hsl(246, 70%, 50%)",
            "loc": 118439
          },
          {
            "name": "repeat",
            "color": "hsl(45, 70%, 50%)",
            "loc": 126616
          },
          {
            "name": "padLeft",
            "color": "hsl(123, 70%, 50%)",
            "loc": 158361
          },
          {
            "name": "padRight",
            "color": "hsl(58, 70%, 50%)",
            "loc": 88686
          },
          {
            "name": "sanitize",
            "color": "hsl(250, 70%, 50%)",
            "loc": 55318
          },
          {
            "name": "ploucify",
            "color": "hsl(127, 70%, 50%)",
            "loc": 89792
          }
        ]
      },
      {
        "name": "misc",
        "color": "hsl(199, 70%, 50%)",
        "children": [
          {
            "name": "greetings",
            "color": "hsl(99, 70%, 50%)",
            "children": [
              {
                "name": "hey",
                "color": "hsl(182, 70%, 50%)",
                "loc": 158600
              },
              {
                "name": "HOWDY",
                "color": "hsl(158, 70%, 50%)",
                "loc": 125891
              },
              {
                "name": "aloha",
                "color": "hsl(151, 70%, 50%)",
                "loc": 94126
              },
              {
                "name": "AHOY",
                "color": "hsl(268, 70%, 50%)",
                "loc": 108658
              }
            ]
          },
          {
            "name": "other",
            "color": "hsl(357, 70%, 50%)",
            "loc": 163340
          },
          {
            "name": "path",
            "color": "hsl(342, 70%, 50%)",
            "children": [
              {
                "name": "pathA",
                "color": "hsl(38, 70%, 50%)",
                "loc": 11845
              },
              {
                "name": "pathB",
                "color": "hsl(84, 70%, 50%)",
                "children": [
                  {
                    "name": "pathB1",
                    "color": "hsl(277, 70%, 50%)",
                    "loc": 11872
                  },
                  {
                    "name": "pathB2",
                    "color": "hsl(146, 70%, 50%)",
                    "loc": 175239
                  },
                  {
                    "name": "pathB3",
                    "color": "hsl(254, 70%, 50%)",
                    "loc": 129175
                  },
                  {
                    "name": "pathB4",
                    "color": "hsl(246, 70%, 50%)",
                    "loc": 155375
                  }
                ]
              },
              {
                "name": "pathC",
                "color": "hsl(145, 70%, 50%)",
                "children": [
                  {
                    "name": "pathC1",
                    "color": "hsl(215, 70%, 50%)",
                    "loc": 135177
                  },
                  {
                    "name": "pathC2",
                    "color": "hsl(323, 70%, 50%)",
                    "loc": 95296
                  },
                  {
                    "name": "pathC3",
                    "color": "hsl(129, 70%, 50%)",
                    "loc": 129124
                  },
                  {
                    "name": "pathC4",
                    "color": "hsl(95, 70%, 50%)",
                    "loc": 61386
                  },
                  {
                    "name": "pathC5",
                    "color": "hsl(356, 70%, 50%)",
                    "loc": 119190
                  },
                  {
                    "name": "pathC6",
                    "color": "hsl(228, 70%, 50%)",
                    "loc": 169001
                  },
                  {
                    "name": "pathC7",
                    "color": "hsl(54, 70%, 50%)",
                    "loc": 75874
                  },
                  {
                    "name": "pathC8",
                    "color": "hsl(68, 70%, 50%)",
                    "loc": 185582
                  },
                  {
                    "name": "pathC9",
                    "color": "hsl(196, 70%, 50%)",
                    "loc": 61346
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
const SunburstChart = () => {
  return (
    <div style={{ height: '500px' }}> 
     <ResponsiveSunburst
        data={data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        id="name"
        value="loc"
        cornerRadius={2}
        borderColor={{ theme: 'background' }}
        colors={{ scheme: 'nivo' }}
        childColor={{
            from: 'color',
            modifiers: [
                [
                    'brighter',
                    0.1
                ]
            ]
        }}
        enableArcLabels={true}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.4
                ]
            ]
        }}
    />
    </div>
  );
};

export default SunburstChart;
