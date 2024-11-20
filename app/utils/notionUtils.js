import { Client, LogLevel } from "@notionhq/client";
import {
  celsiusToF,
  dateToDayOfWeek,
  metersPerSecToMph,
  metersToFeet,
  metersToMiles,
  secondsToTime,
} from "./unitConversionUtils";
import {
  fmtCategoryType,
  fmtWeightCategoryType,
  fmtActivityToExerciseDoneRelation,
} from "./fmtUtils";

const notion = new Client({
  auth: process.env.NOTION_KEY,
  logLevel: LogLevel.DEBUG,
});

const stravaFilter = {
  and: [{ property: "strava_id", rich_text: { is_not_empty: true } }],
};

/**
 * Adds relations to the provided object by fetching relations based on given data.
 * @param {Object} objToFormat - The notion page object.
 */
const addRelations = async (objToFormat) => {
  const relationArray = objToFormat?.properties["Exercises Done"]?.relation;
  if (!relationArray?.length) return objToFormat;

  const relations = await updateRelations(relationArray);
  if (relations?.length > 0) {
    objToFormat.properties["Exercises Done"].relation = relations;
  }

  return objToFormat;
};

/**
 * Formats a Strava activity into the correct Notion format.
 * @param {Object} stravaObject - The Strava activity object.
 * @param {Boolean} shouldAddRelations - Whether to add relations to the object.
 * @returns {Object} A Notion-formatted page object.
 */
export const fmtNotionObject = async (stravaObject, shouldAddRelations = false) => {
  let notionObject = {
    parent: { database_id: process.env.NOTION_DATABASE_ID },
    properties: {},
  };

  // Mapping Strava properties to Notion properties.
  for (const key in stravaObject) {
    switch (key) {
      case "id":
      case "object_id":
        notionObject.properties["strava_id"] = {
          rich_text: [{ text: { content: JSON.stringify(stravaObject[key]) } }],
        };
        break;
      case "title":
      case "name":
        notionObject.properties["Name"] = {
          title: [{ text: { content: stravaObject[key] } }],
        };
        break;
      case "moving_time":
      case "elapsed_time":
        notionObject.properties[key === "moving_time" ? "Moving Time" : "Elapsed Time"] = {
          rich_text: [{ text: { content: secondsToTime(stravaObject[key]) } }],
        };
        break;
      case "total_elevation_gain":
        notionObject.properties["Elevation Gain"] = {
          number: metersToFeet(stravaObject[key]),
        };
        break;
      case "start_date_local":
        notionObject.properties["Date"] = { date: { start: stravaObject[key] } };
        notionObject.properties["Day"] = {
          multi_select: [{ name: dateToDayOfWeek(stravaObject[key]) }],
        };
        break;
      case "average_speed":
        notionObject.properties["Average Speed"] = {
          number: metersPerSecToMph(stravaObject[key]),
        };
        break;
      case "max_speed":
        notionObject.properties["Max Speed"] = {
          number: metersPerSecToMph(stravaObject[key]),
        };
        break;
      case "average_temp":
        notionObject.properties["Average Temp"] = {
          rich_text: [
            {
              text: {
                content: `${celsiusToF(stravaObject[key])}°F | ${stravaObject[key]}°C`,
              },
            },
          ],
        };
        break;
      case "average_heartrate":
      case "max_heartrate":
        notionObject.properties[
          key === "average_heartrate" ? "Average Heart Rate" : "Max Heart Rate"
        ] = { number: stravaObject[key] };
        break;
      case "elev_high":
      case "elev_low":
        notionObject.properties[key === "elev_high" ? "Max Elevation" : "Min Elevation"] = {
          number: metersToFeet(stravaObject[key]),
        };
        break;
      case "type":
        notionObject.properties["Category"] = {
          select: { name: fmtCategoryType(stravaObject[key]) },
        };
        notionObject.properties["Weight Category"] = {
          select: { name: fmtWeightCategoryType(stravaObject[key]) },
        };
        break;
      case "distance":
        notionObject.properties["Distance"] = {
          number: metersToMiles(stravaObject[key]),
        };
        break;
    }
  }

  // Adding sub-category for dog walks.
  if (notionObject?.properties?.Name?.title?.[0]?.text?.content?.toLowerCase()?.includes("dog")) {
    notionObject.properties["Sub Category"] = {
      multi_select: [{ name: "Dog Walk" }],
    };
  }

  // Adding relations if required.
  if (shouldAddRelations) {
    const formattedRelations = fmtActivityToExerciseDoneRelation(stravaObject?.type, shouldAddRelations);
    if (formattedRelations?.length > 0) {
      notionObject.properties["Exercises Done"] = { relation: formattedRelations };
      return await addRelations(notionObject);
    }
  }

  return notionObject;
};

/**
 * Adds a page to the Notion database.
 * @param {Object} itemToAdd - Formatted Notion object.
 */
export const addNotionItem = async (itemToAdd) => {
  try {
    console.log("Trying to add item:", JSON.stringify(itemToAdd));
    const response = await notion.pages.create(itemToAdd);
    console.log("Success! Notion Entry added.");
    return response;
  } catch (error) {
    // logNotionError("Error creating page with Notion SDK", error);
    console.error(`Error creating page with Notion SDK: ${error}`);
    return false;
  }
};

// Helper functions to create, update, and manage Notion pages.

export const updateNotionPage = async (notionId, updateObject) => {
  try {
    const notionPage = await getNotionPageById(notionId);
    if (!notionPage) return false;

    const prevRelationNames = await getRelationNamesByIds(notionPage.properties["Exercises Done"]?.relation);
    const formattedUpdate = await fmtNotionObject(updateObject, prevRelationNames);

    formattedUpdate.page_id = notionId;
    const response = await notion.pages.update(formattedUpdate);
    return response;
  } catch (error) {
    console.error(`Error updating Notion page with ID ${notionId}:`, error);
    // logNotionError("Error attempting to update Notion Page", error);
    return false;
  }
};

// Common utility methods (error logging, querying databases, etc.) go here...

export default {
  fmtNotionObject,
  addNotionItem,
  updateNotionPage,
};
