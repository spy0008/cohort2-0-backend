import { k8sCoreV1Api } from "./config.js";

export async function createPod(sandboxId) {
  const podManifest = {
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: {
        app: "sandbox",
        sandboxId: sandboxId,
      },
    },
    spec: {
      volumes: [
        {
          name: "workspace-volume",
          emptyDir: {},
        },
      ],
      initContainers: [
        {
          name: "init-workspace",

          image: "template:latest",

          imagePullPolicy: "Never",

          command: ["sh", "-c", "cp -r /workspace/. /seed/"],

          volumeMounts: [
            {
              name: "workspace-volume",
              mountPath: "/seed",
            },
          ],
        },
      ],
      containers: [
        {
          image: "template:latest",
          imagePullPolicy: "Never",
          name: "sandbox-container",
          ports: [
            {
              containerPort: 5173,
              name: "http",
            },
          ],
          resources: {
            limits: {
              cpu: "400m",
              memory: "300Mi",
            },
            requests: {
              cpu: "200m",
              memory: "150Mi",
            },
          },
          volumeMounts: [
            {
              name: "workspace-volume",
              mountPath: "/workspace",
            },
          ],
        },
        {
          image: "agent:latest",
          imagePullPolicy: "Never",
          name: "agent-container",
          ports: [
            {
              containerPort: 3000,
              name: "http",
            },
          ],
          resources: {
            limits: {
              cpu: "400m",
              memory: "300Mi",
            },
            requests: {
              cpu: "200m",
              memory: "150Mi",
            },
          },
          volumeMounts: [
            {
              name: "workspace-volume",
              mountPath: "/workspace",
            },
          ],
        },
      ],
    },
  };

  const response = await k8sCoreV1Api.createNamespacedPod({
    namespace: "default",
    body: podManifest,
  });

  return response;
}
