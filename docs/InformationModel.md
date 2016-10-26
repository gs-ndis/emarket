## Logical Data Model

![Logical Data Model](DataModel.png)

## Denormalised JSON models

### Support Item

```
{"SupportItem":{
   "ID":"1234567",
   "Description":"Assisting with, and/or supervising, personal tasks of daily life to develop skills of the participant to live as autonomously as possible.",
   "RegistrationGroup":"Personal Activities High",
   "PriceControlled":True,
   "QuoteNeeded":False,
   "Category":"Assistance with daily life (includes Supported Independent Living)",
   "Outcome":"Daily Living",
   "Purpose":"Core",
   "PriceCaps":[{
      "Unit":"hr",
      "Price":97.68,
      "Locations":["NSW","VIC","QLD","TAS"],
      "Period":"Public Holidays",
      "Intensity":"High",
      "ValidFrom":"2016-07-01"},
      {
      "Unit":"hr",
      "Price":80.17,
      "Locations":["NSW","VIC","QLD","TAS"],
      "Period":"Sundays",
      "Intensity":"High",
      "ValidFrom":"2016-07-01"},
      {
      "Unit":"hr",
      "Price":62.66,
      "Locations":["NSW","VIC","QLD","TAS"],
      "Period":"Saturdays",
      "Intensity":"High",
      "ValidFrom":"2016-07-01"}
   }
}
```
