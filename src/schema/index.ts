export const typeDefs = `#graphql
    scalar JSON

    type Mutation {
        createLandmark(
            name: String!,
            category: String!,
            latitude: String!,
            longitude: String!
        ): Landmark

        deleteLandmark(
            id: ID!
        ): Landmark
        
        createFloor(
            landmarkId: ID!,
            level: String!,
            name: String!,
            dataSetId: ID!,
            fileName: String!,
            fileType: String!,
            filePath: String!,
        ): Floor

        updateFloor(
            id: ID!,
            landmarkId: ID!,
            level: String!,
            name: String!,
            dataSetId: ID!,
            fileName: String!,
            fileType: String!,
            filePath: String!,
        ): Floor!

        deleteFloor(
            id: ID!,
            landmarkId: ID!,
        ): DeleteResponse!

        upsertMarkerById(
            floorId: ID!,
            id: ID
            x: Float!
            y: Float!
            dataSetInfoId: String!
        ): FloorPlanArea

        deleteMarkerById(id: ID!, floorId: ID!): DeleteResponse!

        updateFloorPlanWithAreas(
            id: ID!,
            areas: [FloorPlanAreaInput]
        ): Floor
    }

    type Query {
        getLandmarks: [Landmark!]!
        getLandmarkById(id: ID!): Landmark
        getFloorByLevelId(floorId: String!): Floor
    }

    type FloorPlanArea {
        id: ID!
        x: Float!
        y: Float!
        
        # Details
        dataSetInfoId: String!

        createdAt: String!
        updatedAt: String!
    }


    type Floor {
        id: ID!
        level: String!
        name: String!
        dataSetId: ID!

        # Attachments
        fileName: String
        fileType: String
        filePath: String
        presignedUrl: String

        # Areas
        areas: [FloorPlanArea]

        createdAt: String!
        updatedAt: String!
    }

    type Landmark {
        id: ID!
        name: String!
        category: String!
        latitude: String!
        longitude: String!
        floors: [Floor]
        createdAt: String!
        updatedAt: String!
    }

    type DeleteResponse {
        success: Boolean!
        message: String
        id: ID
    }
    
    input FloorPlanAreaInput {
        id: ID
        x: Float!
        y: Float!
        dataSetInfoId: String!
    }
    
`;
