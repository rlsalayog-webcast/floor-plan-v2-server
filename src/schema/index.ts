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
        ): Floor

        updateFloor(
            id: ID!
            landmarkId: ID!
            level: String!
            name: String!
        ): Floor!

        deleteFloor(
            id: ID!
            landmarkId: ID!
        ): Boolean!

        updateFloorPlanWithAreas(
            floorId: ID!
            id: ID
            attachments: AttachmentInput
            areas: [FloorPlanAreaInput]
        ): FloorPlan
    }

    type Query {
        getLandmarks: [Landmark!]!
        getLandmarkById(id: ID!): Landmark
        getFloorByLevelId(landmarkId: ID!, levelId: String!): Floor
    }

    type Attachment {
        id: ID!
        fileName: String!
        fileType: String!
        filePath: String!
        presignedUrl: String
        createdAt: String!
        updatedAt: String!
    }

    type FloorPlanAreaDetail {
        name: String!
        description: String!
        createdAt: String!
        updatedAt: String!
    }

    type FloorPlanArea {
        id: ID!
        x: String!
        y: String!
        details: FloorPlanAreaDetail!
        createdAt: String!
        updatedAt: String!
    }

    type FloorPlan {
        id: ID!
        attachments: Attachment
        areas: [FloorPlanArea]
        createdAt: String!
        updatedAt: String!
    }


    type Floor {
        id: ID!
        level: String!
        name: String!
        floorPlans: FloorPlan
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

    input FloorPlanAreaDetailInput {
        name: String
        description: String
    }
    
    input FloorPlanAreaInput {
        id: ID
        x: String!
        y: String!
        details: FloorPlanAreaDetailInput
    }
    
    input AttachmentInput {
        id: ID
        fileName: String!
        fileType: String!
        filePath: String!
    }
`;
