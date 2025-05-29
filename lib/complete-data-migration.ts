import { runRobustMigration, clearFirebaseCollections, testFirebaseConnection } from "./robust-migration"

export async function runCompleteDataMigration() {
  console.log("🚀 Starting COMPLETE data migration from Supabase to Firebase...")

  try {
    // Step 1: Test Firebase connection
    console.log("🔍 Step 1: Testing Firebase connection...")
    const connectionTest = await testFirebaseConnection()
    if (!connectionTest.success) {
      throw new Error(`Firebase connection failed: ${connectionTest.error}`)
    }
    console.log("✅ Firebase connection successful")

    // Step 2: Clear existing Firebase data (optional - comment out if you want to keep existing data)
    console.log("🗑️ Step 2: Clearing existing Firebase data...")
    await clearFirebaseCollections()
    console.log("✅ Firebase collections cleared")

    // Step 3: Run the robust migration
    console.log("📦 Step 3: Running complete migration...")
    const migrationResult = await runRobustMigration()

    // Step 4: Report results
    console.log("📊 MIGRATION COMPLETE!")
    console.log("=" * 50)
    console.log(`✅ Total migrated: ${migrationResult.totalMigrated}`)
    console.log(`⏭️ Total skipped: ${migrationResult.totalSkipped}`)
    console.log(`❌ Total errors: ${migrationResult.totalErrors}`)
    console.log("=" * 50)

    // Detailed breakdown
    console.log("📋 Detailed Results:")
    Object.entries(migrationResult.details).forEach(([type, detail]) => {
      console.log(`  ${type}: ${detail.migrated} migrated, ${detail.skipped} skipped, ${detail.errors.length} errors`)
      if (detail.errors.length > 0) {
        detail.errors.forEach((error) => console.log(`    ❌ ${error}`))
      }
    })

    if (migrationResult.success) {
      console.log("🎉 Migration completed successfully!")
    } else {
      console.log("⚠️ Migration completed with errors. Check the logs above.")
    }

    return migrationResult
  } catch (error: any) {
    console.error("💥 Complete migration failed:", error)
    throw error
  }
}

// Helper function to run migration from admin panel
export async function runMigrationFromAdmin() {
  try {
    const result = await runCompleteDataMigration()
    return {
      success: result.success,
      message: `Migration completed. ${result.totalMigrated} items migrated, ${result.totalErrors} errors.`,
      details: result,
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Migration failed: ${error.message}`,
      details: null,
    }
  }
}
