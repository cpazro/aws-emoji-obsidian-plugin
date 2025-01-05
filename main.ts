import { Plugin } from 'obsidian';

export default class AppendEmojiPlugin extends Plugin {
  onload() {
    console.log("Append Emoji Plugin loaded!");

    // List of AWS Compute services (full names)
    const computeServices = [
      "Amazon EC2", "AWS Lambda", "Amazon ECS", "Amazon EKS", "AWS Fargate", "Elastic Beanstalk",
    ];
    
    // List of AWS Compute services (shortened names)
    const computeServicesShort = [
      "EC2", "Lambda", "ECS", "EKS", "Fargate", "Beanstalk",
    ];

    // List of Networking & Content Delivery services with purple heart 💜
    const networkingServices = [
      "Amazon VPC", "CloudFront", "Route 53", "Elastic Load Balancing", "API Gateway", "Direct Connect",
    ];

    // List of Storage services with green heart 💚
    const storageServices = [
      "S3", "EBS", "EFS", "Glacier", "Storage Gateway", "FSx", "Backup",
    ];

	// Database services (💙)
    const databaseServices = [
		"RDS", "DynamoDB", "Aurora", "Redshift", "DocumentDB", "Neptune", "Keyspaces", "Timestream"
	  ];

	// Security, Identity, and Compliance (🔴)
    const securityServices = [
		"IAM", "Cognito", "Shield", "WAF", "Secrets Manager", "KMS", "GuardDuty", "Macie", "Artifact"
	  ];
  

    // Combine all services into a single list for regex matching
    const allServices = [
      ...computeServices, ...computeServicesShort,
      ...networkingServices, ...storageServices,
	  ...securityServices, ...databaseServices
    ];

    this.registerMarkdownPostProcessor((element) => {
      // Create a tree walker to iterate through all text nodes
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let node: Node | null;

      while ((node = walker.nextNode())) {
        // Ensure the node has a non-null value
        if (node.nodeValue) {
          const parent = node.parentNode;

          if (parent) {
            // Check if emojis are already appended
            if (parent.querySelector(".amazon-emoji")) continue;

            // Replace text content with emojis where needed
            const updatedContent = node.nodeValue.replace(
              new RegExp(allServices.join("|"), "g"), // Match all services in the list
              (match) => {
                if (computeServices.includes(match) || computeServicesShort.includes(match)) {
                  return `${match} 🧡`; // Orange heart emoji for AWS Compute services
                } else if (networkingServices.includes(match)) {
                  return `${match} 💜`; // Purple heart emoji for Networking & Content Delivery services
                } else if (storageServices.includes(match)) {
                  return `${match} 💚`; // Green heart emoji for Storage services
                } else if (securityServices.includes(match)) {
					return `${match} 🔴`; // Green heart emoji for Storage services
				} else if (databaseServices.includes(match)) {
					return `${match} 💙`; // Green heart emoji for Storage services
				  }
                return match; // Fallback (though unnecessary with current regex)
              }
            );

            // Replace the text node with the updated content
            if (updatedContent !== node.nodeValue) {
              const wrapper = document.createElement("span");
              wrapper.textContent = updatedContent;
              wrapper.className = "amazon-emoji";
              parent.replaceChild(wrapper, node);
            }
          }
        }
      }
    });
  }

  onunload() {
    console.log("Append Emoji Plugin unloaded!");
  }
}
