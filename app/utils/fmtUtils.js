/**
 * Formats Strava Activity type into the exercises done for the 
 * Notion relation "Exercises Done"
 * @param {String} type Strava API response Activity Type
 * @param {Array} inputArr Optional array to input, useful for updating
 * where we don't want to override any of the old values.
 * @returns {Array} Updated array with unique exercise types.
 */
export const fmtActivityToExerciseDoneRelation = (type, inputArr = []) => {
    let previousExercises = inputArr;
    let stretchRoutine = [
      "Cat Cow",
      "Asian Squat",
      "Downward Dog",
      "Front Neck Stretch",
      "Seal Stretch",
      "Tree Pose",
      "Wall Arm Raises",
      "Worlds Greatest Stretch",
    ];
  
    if (!inputArr.length) {
      previousExercises = [];
    }
  
    switch (type) {
      case "Hike":
        return [...new Set([...previousExercises, "Hike"])]
      case "Run":
        return [...new Set([...previousExercises, "Run"])]
      case "WeightTraining":
        return [...new Set([...previousExercises, ...stretchRoutine])]
      default:
        return [...new Set([...previousExercises])]
    }
  };
  
  /**
   * Formats the Strava API Activity type into my corresponding Notion Category
   * @param {String} type Strava API response Activity Type
   * @returns {String} Corresponding Notion category.
   */
  export const fmtCategoryType = (type) => {
    let categoryType = "";
    switch (type) {
      case "Hike":
        categoryType = "Hikes";
        return categoryType;
      default:
        categoryType = "Habits";
        return categoryType;
    }
  };
  
  /**
   * Formats the Strava API Activity type into my corresponding Notion Weight Category.
   * @param {String} type Strava API response Activity Type
   * @returns {String} Corresponding Notion weight category.
   */
  export const fmtWeightCategoryType = (type) => {
    switch (type) {
      case "AlpineSki":
      case "BackcountrySki":
      case "Hike":
      case "Run":
        return "Cardio";
      case "Walk":
        return "Rest";
      case "WeightTraining":
        return "Weights";
      default:
        return "Cardio";
    }
  };
  