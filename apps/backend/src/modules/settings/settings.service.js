import prisma from "../../config/prisma.js";

export const getSettings = async () => {
  const settings = await prisma.systemSetting.findMany();
  // Convert array of settings to key-value object
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
};

export const updateSettings = async (settingsObject) => {
  const updatedSettings = [];
  
  // Use a transaction to update multiple settings
  await prisma.$transaction(async (tx) => {
    for (const [key, value] of Object.entries(settingsObject)) {
      const setting = await tx.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value), description: `System setting for ${key}` }
      });
      updatedSettings.push(setting);
    }
  });

  return updatedSettings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
};
