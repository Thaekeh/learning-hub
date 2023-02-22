import { Col, Container, red, Row, Table, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { Edit2, Eye, Trash } from "react-feather";
import { IconButton } from "../../components/buttons/IconButton";
import {  TextRow } from "../../types/Texts";
import { getRouteForSingleText } from "../../util/routing/texts";
import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/supabase";

export default function Texts({ texts }: { texts: TextRow[] }) {
	return (
		<Container css={{ marginTop: "$18" }}>
			<Table>
				<Table.Header>
					<Table.Column>Name</Table.Column>
					{/* <Table.Column>Last opened</Table.Column> */}
					<Table.Column> </Table.Column>
				</Table.Header>
				<Table.Body>
					{texts.map((text) => {
						return (
							<Table.Row key={text.id}>
								<Table.Cell>{text.name}</Table.Cell>
								{/* <Table.Cell>{text.updatedAt}</Table.Cell> */}

								<Table.Cell>
									<Row justify="center" align="center">
										<Col css={{ d: "flex" }}>
											<Tooltip content="Open text">
												<Link href={getRouteForSingleText(text.id)}>
													<IconButton>
														<Eye />
													</IconButton>
												</Link>
											</Tooltip>
										</Col>
										{/* <Col css={{ d: "flex" }}>
											<Tooltip content="Rename text">
												<IconButton>
													<Edit2 />
												</IconButton>
											</Tooltip>
										</Col> */}
										<Col css={{ d: "flex" }}>
											<Tooltip content="Delete text">
												<IconButton>
													<Trash color={red.red600} />
												</IconButton>
											</Tooltip>
										</Col>
									</Row>
								</Table.Cell>
							</Table.Row>
						);
					})}
				</Table.Body>
			</Table>
		</Container>
	);
}

export async function getServerSideProps({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}) {
	const supabase = await createServerSupabaseClient<Database>({
		req,
		res,
	});

	const { data: texts } = await supabase.from("texts").select();

	return { props: { texts } };
}
