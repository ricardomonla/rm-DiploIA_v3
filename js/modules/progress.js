export class ProgressTracker {
    constructor() {
        this.storageKey = 'diploia_progress_v1';
        this.progressData = this.loadProgressData();
    }

    loadProgressData() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : {
                classes: {},
                lastActivity: null
            };
        } catch (error) {
            console.warn('Error loading progress data:', error);
            return { classes: {}, lastActivity: null };
        }
    }

    saveProgressData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.progressData));
        } catch (error) {
            console.warn('Error saving progress data:', error);
        }
    }

    getClassProgress(classId) {
        return this.progressData.classes[classId] || {
            lastViewed: null,
            videoProgress: 0,
            currentResource: null,
            resources: {}
        };
    }

    updateClassProgress(classId, updates) {
        if (!this.progressData.classes[classId]) {
            this.progressData.classes[classId] = {
                lastViewed: null,
                videoProgress: 0,
                currentResource: null,
                resources: {}
            };
        }

        Object.assign(this.progressData.classes[classId], updates);
        this.progressData.lastActivity = new Date().toISOString();
        this.saveProgressData();
    }

    updateResourceProgress(classId, resourceType, resourceId, progress) {
        const classProgress = this.getClassProgress(classId);
        if (!classProgress.resources[resourceType]) {
            classProgress.resources[resourceType] = {};
        }

        classProgress.resources[resourceType][resourceId] = {
            ...classProgress.resources[resourceType][resourceId],
            ...progress,
            lastUpdated: new Date().toISOString()
        };

        this.updateClassProgress(classId, { resources: classProgress.resources });
    }

    getCurrentClassProgress(classId) {
        return this.getClassProgress(classId);
    }

    restoreClassProgress(classId) {
        return this.getClassProgress(classId);
    }

    clearProgress(classId) {
        delete this.progressData.classes[classId];
        this.saveProgressData();
    }
}
